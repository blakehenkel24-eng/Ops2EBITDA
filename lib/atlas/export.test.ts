import { describe, expect, it } from "vitest";
import { inflateRawSync } from "node:zlib";
import { generateMemoDocx, generateMemoPdf } from "./export";
import type { ResearchMemo } from "./types";

function readZipEntry(archive: Buffer, entryName: string): Buffer {
  const endOfCentralDirectory = archive.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (endOfCentralDirectory === -1) throw new Error("Invalid ZIP: central directory missing");

  const centralDirectoryOffset = archive.readUInt32LE(endOfCentralDirectory + 16);
  const entryCount = archive.readUInt16LE(endOfCentralDirectory + 10);
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index++) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) throw new Error("Invalid ZIP: malformed directory entry");

    const compression = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localHeaderOffset = archive.readUInt32LE(offset + 42);
    const name = archive.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");

    if (name === entryName) {
      if (archive.readUInt32LE(localHeaderOffset) !== 0x04034b50) throw new Error("Invalid ZIP: local header missing");
      const localNameLength = archive.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = archive.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = archive.subarray(dataStart, dataStart + compressedSize);

      if (compression === 0) return compressed;
      if (compression === 8) return inflateRawSync(compressed);
      throw new Error(`Unsupported ZIP compression method: ${compression}`);
    }

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`ZIP entry not found: ${entryName}`);
}

function sampleMemo(markdown: string): ResearchMemo {
  return {
    mode: "chat",
    query: "Jewelry Retail. Geography: North America.",
    markdown,
    sources: [],
    confidence: "medium",
    createdAt: "Jul 4, 2026",
    scores: {},
  };
}

describe("Atlas IQ PDF export", () => {
  it("renders markdown structure instead of leaking raw markdown syntax", () => {
    const pdf = generateMemoPdf(sampleMemo([
      "# PE Market Research Memo",
      "> **Executive Read:** Fragmented market with margin pressure.",
      "",
      "## Industry Metrics",
      "| Metric / KPI | Directional Range | Diligence Implication |",
      "|---|---|---|",
      "| Gross margin | **40-85%** | Validate by channel mix |",
      "",
      "### Critical Gaps",
      "- **EBITDA margin:** private benchmark still needed.",
    ].join("\n")));

    const raw = Buffer.from(pdf).toString("latin1");
    expect(raw).toContain("Executive");
    expect(raw).toContain("Read:");
    expect(raw).toContain("Gross margin");
    expect(raw).not.toContain("CHAT MODE");
    expect(raw).not.toContain("CONFIDENCE:");
    expect(raw).not.toContain("0 SOURCES");
    expect(raw).not.toContain("> **Executive Read:**");
    expect(raw).not.toContain("### Critical Gaps");
    expect(raw).not.toContain("|---|---|---|");
    expect(raw).not.toContain("**EBITDA margin:**");
  });
});

describe("Atlas IQ DOCX export", () => {
  it("creates a structurally valid OOXML document from markdown", async () => {
    const docx = await generateMemoDocx(sampleMemo([
      "# PE Market Research Memo",
      "> **Executive Read:** Fragmented market with margin pressure.",
      "",
      "## Industry Metrics",
      "| Metric / KPI | Directional Range | Diligence Implication |",
      "|---|---|---|",
      "| Gross margin | **40-85%** | Validate by channel mix |",
      "",
      "### Critical Gaps",
      "- **EBITDA margin:** private benchmark still needed.",
      "1. Validate channel mix.",
    ].join("\n")));

    const archive = Buffer.from(docx);
    expect(archive.subarray(0, 4).toString("hex")).toBe("504b0304");

    const contentTypes = readZipEntry(archive, "[Content_Types].xml").toString("utf8");
    const relationships = readZipEntry(archive, "_rels/.rels").toString("utf8");
    const document = readZipEntry(archive, "word/document.xml").toString("utf8");
    const numbering = readZipEntry(archive, "word/numbering.xml").toString("utf8");
    const footer = readZipEntry(archive, "word/footer1.xml").toString("utf8");

    expect(contentTypes).toContain("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml");
    expect(relationships).toContain("officeDocument");
    expect(document).toContain("PE Market Research Memo");
    expect(document).toContain("Executive Read:");
    expect(document).toContain("Gross margin");
    expect(document).toContain("40-85%");
    expect(document).toContain("<w:tbl>");
    expect(document).toContain('<w:gridCol w:w="3120"');
    expect(document).not.toContain('<w:gridCol w:w="100"');
    expect(document).toContain("<w:numPr>");
    expect(document).not.toContain("# PE Market Research Memo");
    expect(document).not.toContain("**Executive Read:**");
    expect(document).not.toContain("|---|---|---|");
    expect(numbering).toContain('w:numFmt w:val="decimal"');
    expect(footer).toContain('w:fldChar w:fldCharType="begin"');
    expect(footer).toContain("PAGE");
  });
});
