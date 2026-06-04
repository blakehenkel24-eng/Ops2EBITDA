import jsPDF from "jspdf";
import type { ResearchMemo } from "./types";

export function generateMemoPdf(memo: ResearchMemo): ArrayBuffer {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("ATLAS IQ — PROPRIETARY RESEARCH MEMO", margin, y);
  y += 24;

  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text(memo.query, margin, y, { maxWidth: contentWidth });
  y += 28;

  doc.setFontSize(8);
  doc.setTextColor(120);
  const meta = `${memo.mode.toUpperCase()} MODE · ${memo.sources.length} sources · Confidence: ${memo.confidence} · ${memo.createdAt}`;
  doc.text(meta, margin, y);
  y += 24;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  doc.setFontSize(10);
  doc.setTextColor(50);

  const lines = memo.markdown.split("\n");
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }

    if (line.startsWith("## ")) {
      y += 8;
      doc.setFontSize(13);
      doc.setTextColor(30);
      doc.text(line.replace("## ", ""), margin, y, { maxWidth: contentWidth });
      y += 18;
      doc.setFontSize(10);
      doc.setTextColor(50);
    } else if (line.startsWith("# ")) {
      y += 12;
      doc.setFontSize(16);
      doc.setTextColor(20);
      doc.text(line.replace("# ", ""), margin, y, { maxWidth: contentWidth });
      y += 22;
      doc.setFontSize(10);
      doc.setTextColor(50);
    } else if (line.trim()) {
      const wrapped = doc.splitTextToSize(line, contentWidth);
      for (const wLine of wrapped) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(wLine, margin, y);
        y += 14;
      }
    } else {
      y += 8;
    }
  }

  return doc.output("arraybuffer");
}
