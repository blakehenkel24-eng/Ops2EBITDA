import { describe, expect, it } from "vitest";
import { Document, Packer, Paragraph } from "docx";
import { POST } from "./route";

const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function requestWith(file: File, frameworkId = "buy-side") {
  const form = new FormData();
  form.append("file", file);
  form.append("frameworkId", frameworkId);
  return POST(new Request("http://localhost/api/atlas/document-studio/inspect", { method: "POST", body: form }));
}

describe("Document Studio inspection route", () => {
  it("returns findings grounded in uploaded DOCX text", async () => {
    const document = new Document({ sections: [{ children: [new Paragraph("Residuals may be retained in unaided memory.")] }] });
    const bytes = await Packer.toBuffer(document);
    const response = await requestWith(new File([Uint8Array.from(bytes)], "counterparty-nda.docx", { type: DOCX_TYPE }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.inspection).toMatchObject({ filename: "counterparty-nda.docx", frameworkId: "buy-side" });
    expect(body.inspection.findings[0]).toMatchObject({ clause: "Residuals", sourceId: "p-1" });
  });

  it("rejects a fake DOCX without leaking its content", async () => {
    const response = await requestWith(new File(["secret fake content"], "fake.docx", { type: DOCX_TYPE }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("not a valid .docx");
    expect(JSON.stringify(body)).not.toContain("secret fake content");
  });

  it("rejects unknown framework identifiers", async () => {
    const response = await requestWith(new File(["x"], "fake.docx", { type: DOCX_TYPE }), "unknown");
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Choose a valid framework" });
  });
});
