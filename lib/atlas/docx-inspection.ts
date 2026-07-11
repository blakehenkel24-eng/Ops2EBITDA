import { inflateRawSync } from "node:zlib";
import type { DocumentFinding, DocumentInspection, SampleFramework } from "@/lib/atlas/document-studio";
import { MAX_DOCX_BYTES } from "@/lib/atlas/document-studio";

const MAX_ZIP_ENTRIES = 2_000;
const MAX_UNCOMPRESSED_BYTES = 50 * 1024 * 1024;
const DOCUMENT_XML = "word/document.xml";

type ZipEntry = {
  name: string;
  compression: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
};

export class DocxInspectionError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "DocxInspectionError";
  }
}

function listZipEntries(archive: Buffer): ZipEntry[] {
  if (archive.length < 22 || archive.subarray(0, 4).toString("hex") !== "504b0304") {
    throw new DocxInspectionError("File content is not a valid .docx package");
  }
  const end = archive.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (end === -1 || end + 22 > archive.length) throw new DocxInspectionError("DOCX directory is missing");
  const count = archive.readUInt16LE(end + 10);
  const directoryOffset = archive.readUInt32LE(end + 16);
  if (count === 0 || count > MAX_ZIP_ENTRIES) throw new DocxInspectionError("DOCX package has an unsafe number of entries");

  const entries: ZipEntry[] = [];
  let total = 0;
  let offset = directoryOffset;
  for (let index = 0; index < count; index += 1) {
    if (offset + 46 > archive.length || archive.readUInt32LE(offset) !== 0x02014b50) {
      throw new DocxInspectionError("DOCX directory is malformed");
    }
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const name = archive.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    total += uncompressedSize;
    if (total > MAX_UNCOMPRESSED_BYTES) throw new DocxInspectionError("DOCX package expands beyond the safe limit", 413);
    entries.push({
      name,
      compression: archive.readUInt16LE(offset + 10),
      compressedSize,
      uncompressedSize,
      localHeaderOffset: archive.readUInt32LE(offset + 42),
    });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function readEntry(archive: Buffer, entry: ZipEntry): Buffer {
  const offset = entry.localHeaderOffset;
  if (offset + 30 > archive.length || archive.readUInt32LE(offset) !== 0x04034b50) {
    throw new DocxInspectionError("DOCX entry is malformed");
  }
  const nameLength = archive.readUInt16LE(offset + 26);
  const extraLength = archive.readUInt16LE(offset + 28);
  const start = offset + 30 + nameLength + extraLength;
  const end = start + entry.compressedSize;
  if (end > archive.length) throw new DocxInspectionError("DOCX entry is truncated");
  const compressed = archive.subarray(start, end);
  const output = entry.compression === 0
    ? Buffer.from(compressed)
    : entry.compression === 8
      ? inflateRawSync(compressed, { maxOutputLength: MAX_UNCOMPRESSED_BYTES })
      : null;
  if (!output) throw new DocxInspectionError("DOCX uses an unsupported compression method");
  if (output.length !== entry.uncompressedSize) throw new DocxInspectionError("DOCX entry size does not match its directory");
  return output;
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

export function extractDocxParagraphs(bytes: Uint8Array) {
  const archive = Buffer.from(bytes);
  const entries = listZipEntries(archive);
  if (!entries.some((entry) => entry.name === "[Content_Types].xml")) {
    throw new DocxInspectionError("File is a ZIP archive, but not a Word document");
  }
  const documentEntry = entries.find((entry) => entry.name === DOCUMENT_XML);
  if (!documentEntry) throw new DocxInspectionError("Word document body is missing");
  const xml = readEntry(archive, documentEntry).toString("utf8");
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new DocxInspectionError("DOCX contains unsupported XML declarations");

  return Array.from(xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g))
    .map((match, index) => {
      const content = match[1];
      const text = Array.from(content.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\s*\/>/g))
        .map((part) => part[1] === undefined ? "\t" : decodeXml(part[1]))
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      return { id: `p-${index + 1}`, text };
    })
    .filter((paragraph) => paragraph.text.length > 0);
}

const BUY_SIDE_RULES = [
  { clause: "Residuals", pattern: /\bresiduals?\b|unaided memory/i, severity: "change", recommendation: "Remove the residuals carve-out.", reason: "The sample framework does not permit retained deal information to be used from memory.", rule: "NDA-RES-001" },
  { clause: "Confidentiality term", pattern: /confidential(?:ity)? (?:obligations?|period)|(?:term|period) of (?:this )?(?:agreement|confidentiality)/i, severity: "review", recommendation: "Confirm the confidentiality period matches the approved framework.", reason: "Term language varies and should be checked against the firm-approved duration.", rule: "NDA-TERM-001" },
  { clause: "Non-solicitation", pattern: /non[- ]solicit|solicit(?:ation|ing)? (?:any )?(?:employee|personnel)/i, severity: "review", recommendation: "Narrow the restriction to named employees and an approved duration.", reason: "Broad employee restrictions can exceed the sample buy-side position.", rule: "NDA-NS-001" },
  { clause: "Governing law", pattern: /govern(?:ed|ing) by|governing law|exclusive jurisdiction/i, severity: "escalate", recommendation: "Escalate non-standard governing law or venue to legal review.", reason: "Venue is not changed automatically under the sample framework.", rule: "NDA-LAW-001" },
] as const;

const MUTUAL_RULES = [
  { clause: "Residuals", pattern: /\bresiduals?\b|unaided memory/i, severity: "review", recommendation: "Narrow the residuals clause so neither party may use deal-specific or competitively sensitive information.", reason: "The sample mutual framework permits only a tightly limited residuals fallback applied equally to both parties.", rule: "MUT-RES-001" },
  { clause: "Confidentiality term", pattern: /confidential(?:ity)? (?:obligations?|period)|(?:term|period) of (?:this )?(?:agreement|confidentiality)/i, severity: "review", recommendation: "Confirm the same confidentiality period applies to both parties.", reason: "The sample mutual framework requires reciprocal duration and survival language.", rule: "MUT-TERM-001" },
  { clause: "Governing law", pattern: /govern(?:ed|ing) by|governing law|exclusive jurisdiction/i, severity: "escalate", recommendation: "Escalate non-standard governing law or venue to legal review.", reason: "Venue is not changed automatically under the sample mutual framework.", rule: "MUT-LAW-001" },
] as const;

export function inspectDocx(input: { bytes: Uint8Array; filename: string; frameworkId: SampleFramework["id"] }): DocumentInspection {
  if (input.bytes.byteLength === 0 || input.bytes.byteLength > MAX_DOCX_BYTES) {
    throw new DocxInspectionError("DOCX must be between 1 byte and 15 MB", 413);
  }
  const paragraphs = extractDocxParagraphs(input.bytes);
  if (!paragraphs.length) throw new DocxInspectionError("No readable paragraphs were found in this document");

  const findings: DocumentFinding[] = [];
  const rules = input.frameworkId === "mutual" ? MUTUAL_RULES : BUY_SIDE_RULES;
  for (const paragraph of paragraphs) {
    for (const rule of rules) {
      if (!rule.pattern.test(paragraph.text)) continue;
      findings.push({
        id: `${rule.rule}-${paragraph.id}`,
        clause: rule.clause,
        severity: rule.severity,
        sourceId: paragraph.id,
        sourceText: paragraph.text.slice(0, 1_500),
        recommendation: rule.recommendation,
        reason: rule.reason,
        frameworkRule: rule.rule,
      });
      break;
    }
  }

  return {
    filename: input.filename,
    size: input.bytes.byteLength,
    paragraphCount: paragraphs.length,
    wordCount: paragraphs.reduce((count, paragraph) => count + paragraph.text.split(/\s+/).length, 0),
    frameworkId: input.frameworkId,
    findings,
  };
}
