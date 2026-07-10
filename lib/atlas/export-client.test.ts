import { describe, expect, it } from "vitest";
import {
  buildExportMemo,
  getExportCommandFormat,
  getLastAssistantExportTarget,
} from "./export-client";

describe("Atlas IQ export client helpers", () => {
  it("builds a report export memo with the requested format metadata", () => {
    const memo = buildExportMemo({
      mode: "market",
      query: "Behavioral health services",
      markdown: "## Executive Read\nStrong demand, but labor is the constraint.",
    });

    expect(memo).toMatchObject({
      mode: "market",
      query: "Behavioral health services",
      markdown: "## Executive Read\nStrong demand, but labor is the constraint.",
      confidence: "medium",
      scores: {},
      sources: [],
    });
    expect(memo.createdAt).toMatch(/[A-Z][a-z]{2}/);
  });

  it("recognizes PDF and Word export slash commands", () => {
    expect(getExportCommandFormat("/pdf")).toBe("pdf");
    expect(getExportCommandFormat("/PDF ")).toBe("pdf");
    expect(getExportCommandFormat("/word")).toBe("docx");
    expect(getExportCommandFormat("/docx")).toBe("docx");
    expect(getExportCommandFormat("/market")).toBeNull();
  });

  it("selects the latest assistant message and report context when available", () => {
    const target = getLastAssistantExportTarget([
      { role: "user", text: "[mode:company] Acme Industrial" },
      { role: "assistant", text: "Company report output" },
      { role: "user", text: "Thanks" },
    ]);

    expect(target).toEqual({
      mode: "company",
      query: "Acme Industrial",
      markdown: "Company report output",
    });
  });

  it("falls back to chat context for ordinary assistant messages", () => {
    const target = getLastAssistantExportTarget([
      { role: "user", text: "Explain EBITDA margin expansion" },
      { role: "assistant", text: "Margin expansion comes from price, mix, and cost control." },
    ]);

    expect(target).toEqual({
      mode: "chat",
      query: "Explain EBITDA margin expansion",
      markdown: "Margin expansion comes from price, mix, and cost control.",
    });
  });
});
