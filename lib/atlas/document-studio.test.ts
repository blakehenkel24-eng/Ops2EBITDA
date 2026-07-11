import { describe, expect, it } from "vitest";
import { isDocxFilename, reviewIsComplete, validateDocxFile } from "./document-studio";

describe("Document Studio prototype guards", () => {
  it("recognizes DOCX names without reading a file", () => {
    expect(isDocxFilename("Counterparty NDA.DOCX")).toBe(true);
    expect(isDocxFilename("Counterparty NDA.pdf")).toBe(false);
  });

  it("validates client-side file constraints", () => {
    expect(validateDocxFile({ name: "nda.docx", size: 1024, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })).toBeNull();
    expect(validateDocxFile({ name: "nda.pdf", size: 1024, type: "application/pdf" })).toContain(".docx");
    expect(validateDocxFile({ name: "nda.docx", size: 0, type: "" })).toContain("empty");
  });

  it("requires a decision for every finding", () => {
    const findings = [{ id: "one" }, { id: "two" }] as Parameters<typeof reviewIsComplete>[0];
    expect(reviewIsComplete(findings, { one: "accepted" })).toBe(false);
    expect(reviewIsComplete(findings, { one: "accepted", two: "escalated" })).toBe(true);
  });
});
