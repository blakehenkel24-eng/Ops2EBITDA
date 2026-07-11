import { describe, expect, it } from "vitest";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { DocxInspectionError, extractDocxParagraphs, inspectDocx } from "./docx-inspection";

async function makeDocx(lines: (string | string[])[]) {
  const document = new Document({
    sections: [{
      children: lines.map((line) => new Paragraph({
        children: (Array.isArray(line) ? line : [line]).map((text) => new TextRun(text)),
      })),
    }],
  });
  return new Uint8Array(await Packer.toBuffer(document));
}

describe("DOCX inspection", () => {
  it("extracts paragraphs across split Word runs", async () => {
    const bytes = await makeDocx([["Residuals may be retained in ", "unaided memory."], "Second paragraph"]);
    expect(extractDocxParagraphs(bytes)).toEqual([
      { id: "p-1", text: "Residuals may be retained in unaided memory." },
      { id: "p-2", text: "Second paragraph" },
    ]);
  });

  it("returns grounded deterministic findings", async () => {
    const bytes = await makeDocx([
      "Residuals may be retained in unaided memory.",
      "This Agreement is governed by the laws of Delaware.",
    ]);
    const inspection = inspectDocx({ bytes, filename: "nda.docx", frameworkId: "buy-side" });
    expect(inspection.paragraphCount).toBe(2);
    expect(inspection.findings.map((finding) => finding.clause)).toEqual(["Residuals", "Governing law"]);
    expect(inspection.findings[0]).toMatchObject({ sourceId: "p-1", frameworkRule: "NDA-RES-001" });
    expect(inspection.findings[0].sourceText).toContain("unaided memory");
  });

  it("applies distinct framework rules", async () => {
    const bytes = await makeDocx(["Residuals may be retained in unaided memory."]);
    const buySide = inspectDocx({ bytes, filename: "nda.docx", frameworkId: "buy-side" });
    const mutual = inspectDocx({ bytes, filename: "nda.docx", frameworkId: "mutual" });

    expect(buySide.findings[0]).toMatchObject({ severity: "change", frameworkRule: "NDA-RES-001" });
    expect(mutual.findings[0]).toMatchObject({ severity: "review", frameworkRule: "MUT-RES-001" });
  });

  it("rejects content that is not a DOCX package", () => {
    expect(() => extractDocxParagraphs(new TextEncoder().encode("not a zip"))).toThrow(DocxInspectionError);
  });
});
