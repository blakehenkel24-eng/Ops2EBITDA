import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Footer,
  Header,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  TableLayoutType,
  WidthType,
} from "docx";
import type { ResearchMemo } from "./types";

const DOC_FONT = "Cambria";
const PDF_SERIF = "times";

const PDF = {
  ink: [31, 42, 55] as const,
  stone: [95, 111, 130] as const,
  muted: [128, 140, 154] as const,
  line: [205, 214, 224] as const,
  paper: [248, 251, 253] as const,
  accent: [19, 78, 130] as const,
  accentSoft: [231, 241, 250] as const,
  white: [255, 255, 255] as const,
};

type PdfFontStyle = "normal" | "bold" | "italic" | "bolditalic";
type PdfInlineRun = {
  text: string;
  style: PdfFontStyle;
  code?: boolean;
};

function setPdfColor(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setPdfFill(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setPdfDraw(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function stripMarkdownInline(text: string) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/<\/?[A-Za-z][A-Za-z0-9:_-]*(?:\s+[^>]*)?>/g, "");
}

function stripMarkdown(text: string) {
  return stripMarkdownInline(text).trim();
}

function cleanPdfLine(line: string) {
  const trimmed = line.trim();
  if (/^<\/?[A-Za-z][A-Za-z0-9:_-]*(?:\s+[^>]*)?>$/.test(trimmed)) return "";
  return line.replace(/<\/?[A-Za-z][A-Za-z0-9:_-]*(?:\s+[^>]*)?>/g, "").trimEnd();
}

function parsePdfInline(text: string): PdfInlineRun[] {
  const clean = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  const parts = clean.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.filter(Boolean).map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return { text: part.slice(2, -2), style: "bold" as const };
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return { text: part.slice(1, -1), style: "italic" as const };
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return { text: part.slice(1, -1), style: "normal" as const, code: true };
    }
    return { text: stripMarkdownInline(part), style: "normal" as const };
  }).filter((run) => run.text.length > 0);
}

function parsePdfTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => stripMarkdown(cell));
}

function isPdfTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

function isPdfTableRow(line: string) {
  return /^\s*\|.*\|\s*$/.test(line) || line.trim().includes("|");
}

function getMemoTitle(memo: ResearchMemo) {
  const firstHeading = memo.markdown.split("\n").find((line) => line.trim().startsWith("# "));
  return stripMarkdown(firstHeading ? firstHeading.trim().slice(2) : memo.query);
}

function drawPdfWordmark(doc: jsPDF, x: number, y: number, size: number) {
  doc.setFont(PDF_SERIF, "bold");
  doc.setFontSize(size);
  setPdfColor(doc, PDF.ink);
  doc.text("Ops", x, y);
  const opsWidth = doc.getTextWidth("Ops");
  doc.setFont(PDF_SERIF, "bolditalic");
  setPdfColor(doc, PDF.accent);
  doc.text("2", x + opsWidth + 1.2, y);
  const twoWidth = doc.getTextWidth("2");
  doc.setFont(PDF_SERIF, "bold");
  setPdfColor(doc, PDF.ink);
  doc.text("EBITDA", x + opsWidth + twoWidth + 2.4, y);
}

export function generateMemoPdf(memo: ResearchMemo): ArrayBuffer {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const top = 68;
  const bottom = pageHeight - 58;
  const title = getMemoTitle(memo);
  let y = margin;

  const drawPageHeader = () => {
    drawPdfWordmark(doc, margin, 34, 11);
    doc.setFont(PDF_SERIF, "normal");
    doc.setFontSize(9.5);
    setPdfColor(doc, PDF.stone);
    doc.text("Atlas IQ", pageWidth - margin, 34, { align: "right" });
    setPdfDraw(doc, PDF.line);
    doc.setLineWidth(0.45);
    doc.line(margin, 45, pageWidth - margin, 45);
  };

  const addFooter = () => {
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      drawPageHeader();
      setPdfDraw(doc, PDF.line);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);
      doc.setFont(PDF_SERIF, "normal");
      doc.setFontSize(8);
      setPdfColor(doc, PDF.muted);
      doc.text(String(i), pageWidth - margin, pageHeight - 20, { align: "right" });
    }
  };

  const ensureSpace = (needed: number) => {
    if (y + needed <= bottom) return;
    doc.addPage();
    y = top;
  };

  const renderInline = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    options: {
      fontSize?: number;
      lineHeight?: number;
      color?: readonly [number, number, number];
      defaultStyle?: PdfFontStyle;
    } = {}
  ) => {
    const fontSize = options.fontSize ?? 10;
    const lineHeight = options.lineHeight ?? 15;
    const color = options.color ?? PDF.ink;
    const defaultStyle = options.defaultStyle ?? "normal";
    let cursorX = x;
    let cursorY = startY;
    let lineStart = true;

    const drawWord = (word: string, run: PdfInlineRun, suffix = "") => {
      const token = `${word}${suffix}`;
      const style = run.style === "normal" ? defaultStyle : run.style;
      doc.setFont(run.code ? "courier" : PDF_SERIF, style);
      doc.setFontSize(run.code ? fontSize - 0.5 : fontSize);
      setPdfColor(doc, run.code ? PDF.accent : color);
      const width = doc.getTextWidth(token);
      if (!lineStart && cursorX + width > x + maxWidth) {
        cursorY += lineHeight;
        cursorX = x;
        lineStart = true;
      }
      doc.text(token, cursorX, cursorY);
      cursorX += width;
      lineStart = false;
    };

    for (const run of parsePdfInline(text)) {
      const words = run.text.split(/(\s+)/).filter(Boolean);
      for (const part of words) {
        if (/^\s+$/.test(part)) {
          if (!lineStart) cursorX += doc.getTextWidth(" ");
          continue;
        }
        drawWord(part, run);
      }
    }

    return cursorY + lineHeight;
  };

  const renderParagraph = (text: string, opts: Parameters<typeof renderInline>[4] = {}) => {
    const clean = stripMarkdown(text) ? text : cleanPdfLine(text);
    if (!clean.trim()) return;
    ensureSpace(34);
    y = renderInline(clean, margin, y, contentWidth, {
      fontSize: 10.8,
      lineHeight: 15,
      color: PDF.ink,
      ...opts,
    }) + 2;
  };

  const renderHeading = (text: string, level: 1 | 2 | 3 | 4) => {
    const clean = stripMarkdown(text);
    const sizes = { 1: 16, 2: 13.5, 3: 11.5, 4: 10 };
    const spaces = { 1: 42, 2: 34, 3: 27, 4: 22 };
    ensureSpace(spaces[level]);
    y += level <= 2 ? 7 : 4;
    doc.setFont(PDF_SERIF, level <= 2 ? "bold" : "bold");
    doc.setFontSize(sizes[level]);
    setPdfColor(doc, level === 4 ? PDF.stone : PDF.ink);
    const lines = doc.splitTextToSize(clean, contentWidth);
    for (const line of lines) {
      doc.text(line, margin, y);
      y += level <= 2 ? 19 : 15;
    }
    if (level === 2) {
      setPdfDraw(doc, PDF.line);
      doc.setLineWidth(0.5);
      doc.line(margin, y - 5, pageWidth - margin, y - 5);
      y += 5;
    } else {
      y += 4;
    }
  };

  const renderCallout = (text: string) => {
    const clean = text.replace(/^>\s*/, "");
    ensureSpace(26);
    const renderedBottom = renderInline(clean, margin, y, contentWidth, {
      fontSize: 10.8,
      lineHeight: 15.2,
      color: PDF.ink,
    });
    y = renderedBottom + 6;
  };

  const renderBullet = (text: string, depth: number, orderedLabel?: string) => {
    const indent = Math.min(depth, 3) * 16;
    const bulletX = margin + indent;
    const textX = bulletX + 14;
    ensureSpace(30);
    doc.setFont(PDF_SERIF, orderedLabel ? "bold" : "normal");
    doc.setFontSize(9.5);
    setPdfColor(doc, PDF.accent);
    doc.text(orderedLabel ?? "-", bulletX, y);
    y = renderInline(text, textX, y, contentWidth - indent - 14, {
      fontSize: 10.8,
      lineHeight: 15,
      color: PDF.ink,
    });
    y += 2;
  };

  const renderRule = () => {
    ensureSpace(24);
    setPdfDraw(doc, PDF.line);
    doc.setLineWidth(0.6);
    doc.line(margin, y + 4, pageWidth - margin, y + 4);
    y += 22;
  };

  const renderTable = (headers: string[], rows: string[][]) => {
    const colCount = Math.max(headers.length, ...rows.map((row) => row.length));
    const colWidth = contentWidth / colCount;
    const cellPadX = 6;
    const cellPadY = 7;

    const rowHeight = (row: string[], header = false) => {
      const fontSize = header ? 8.1 : 8.7;
      doc.setFont(PDF_SERIF, header ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const maxLines = Array.from({ length: colCount }, (_, i) =>
        doc.splitTextToSize(stripMarkdown(row[i] ?? ""), colWidth - cellPadX * 2).length
      ).reduce((max, count) => Math.max(max, count), 1);
      return Math.max(header ? 30 : 34, maxLines * (header ? 10 : 11.5) + cellPadY * 2);
    };

    const drawRow = (row: string[], header = false) => {
      const height = rowHeight(row, header);
      ensureSpace(height + 4);
      setPdfFill(doc, header ? PDF.accentSoft : PDF.white);
      setPdfDraw(doc, PDF.line);
      doc.rect(margin, y, contentWidth, height, "FD");
      for (let i = 0; i < colCount; i++) {
        const x = margin + i * colWidth;
        if (i > 0) {
          setPdfDraw(doc, PDF.line);
          doc.line(x, y, x, y + height);
        }
        doc.setFont(PDF_SERIF, header ? "bold" : "normal");
        doc.setFontSize(header ? 8.1 : 8.7);
        setPdfColor(doc, header ? PDF.accent : PDF.ink);
        const text = stripMarkdown(row[i] ?? "");
        const lines = doc.splitTextToSize(text, colWidth - cellPadX * 2);
        lines.forEach((line: string, idx: number) => {
          doc.text(line, x + cellPadX, y + cellPadY + 8 + idx * (header ? 10 : 11.5));
        });
      }
      y += height;
    };

    y += 8;
    ensureSpace(rowHeight(headers, true) + (rows[0] ? rowHeight(rows[0]) : 0) + 4);
    drawRow(headers, true);
    rows.forEach((row) => drawRow(row));
    y += 14;
  };

  setPdfFill(doc, PDF.white);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  drawPageHeader();
  y = 90;

  doc.setFont(PDF_SERIF, "bold");
  doc.setFontSize(24);
  setPdfColor(doc, PDF.ink);
  const titleLines = doc.splitTextToSize(title, contentWidth * 0.9);
  for (const line of titleLines) {
    doc.text(line, margin, y);
    y += 29;
  }

  y += 8;
  setPdfDraw(doc, PDF.line);
  doc.setLineWidth(0.7);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  const lines = memo.markdown.split("\n").map(cleanPdfLine);
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) {
      y += 5;
      continue;
    }

    if (isPdfTableRow(rawLine) && i + 1 < lines.length && isPdfTableSeparator(lines[i + 1])) {
      const headers = parsePdfTableRow(rawLine);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && isPdfTableRow(lines[i]) && !isPdfTableSeparator(lines[i])) {
        rows.push(parsePdfTableRow(lines[i]));
        i++;
      }
      i--;
      renderTable(headers, rows);
      continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      renderRule();
      continue;
    }

    if (trimmed.startsWith("> ")) {
      renderCallout(trimmed);
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      renderHeading(trimmed.slice(5), 4);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      renderHeading(trimmed.slice(4), 3);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      renderHeading(trimmed.slice(3), 2);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (stripMarkdown(trimmed.slice(2)) === title) continue;
      renderHeading(trimmed.slice(2), 1);
      continue;
    }

    const bullet = rawLine.match(/^(\s*)[-*]\s+(.+)/);
    if (bullet) {
      renderBullet(bullet[2], Math.floor(bullet[1].length / 2));
      continue;
    }

    const numbered = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numbered) {
      renderBullet(numbered[2], 0, `${numbered[1]}.`);
      continue;
    }

    renderParagraph(trimmed);
  }

  addFooter();
  return doc.output("arraybuffer");
}

function parseTableBlock(lines: string[], startIdx: number): { table: Table; endIdx: number } | null {
  const headerLine = lines[startIdx];
  if (!headerLine || !headerLine.includes("|")) return null;

  const sepLine = lines[startIdx + 1];
  if (!sepLine || !/^\s*\|?\s*:?-{2,}/.test(sepLine)) return null;

  const parseRow = (line: string) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());

  const headers = parseRow(headerLine);
  const rows: string[][] = [];
  let i = startIdx + 2;
  while (i < lines.length && lines[i].includes("|") && !/^\s*\|?\s*:?-{2,}/.test(lines[i])) {
    rows.push(parseRow(lines[i]));
    i++;
  }

  const table = new Table({
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => new TableCell({
          width: { size: Math.floor(9360 / headers.length), type: WidthType.DXA },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          shading: { fill: "F2F6FA" },
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true, size: 18, font: DOC_FONT, color: "134E82" })],
            spacing: { before: 0, after: 0, line: 260 },
          })],
          borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "C7D2DE" } },
        })),
      }),
      ...rows.map(row => new TableRow({
        children: row.map(cell => new TableCell({
          width: { size: Math.floor(9360 / headers.length), type: WidthType.DXA },
          margins: { top: 130, bottom: 130, left: 140, right: 140 },
          children: [new Paragraph({ children: parseInlineRuns(cell, 18) })],
          borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6DEE7" } },
        })),
      })),
    ],
    width: { size: 9360, type: WidthType.DXA },
  });

  return { table, endIdx: i };
}

function parseInlineRuns(text: string, size = 20): TextRun[] {
  const parts = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1").split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.filter(Boolean).map(part => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({ text: part.slice(2, -2), bold: true, size, font: DOC_FONT });
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return new TextRun({ text: part.slice(1, -1), italics: true, size, font: DOC_FONT });
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return new TextRun({ text: part.slice(1, -1), size: Math.max(size - 1, 16), font: "Courier New", color: "134E82" });
    }
    return new TextRun({ text: stripMarkdownInline(part), size, font: DOC_FONT });
  });
}

function ops2EbitdaWordmarkRuns(size = 21): TextRun[] {
  return [
    new TextRun({ text: "Ops", size, font: DOC_FONT, bold: true, color: "1F2A37" }),
    new TextRun({ text: "2", size: size + 1, font: DOC_FONT, bold: true, italics: true, color: "2D63A8" }),
    new TextRun({ text: "EBITDA", size, font: DOC_FONT, bold: true, color: "1F2A37" }),
  ];
}

export async function generateMemoDocx(memo: ResearchMemo): Promise<ArrayBuffer> {
  const children: (Paragraph | Table)[] = [];
  const title = getMemoTitle(memo);

  children.push(new Paragraph({
    children: [new TextRun({ text: title, size: 34, bold: true, font: DOC_FONT, color: "1F2A37" })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 260, after: 180, line: 280 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "C7D2DE", space: 8 } },
  }));

  const lines = memo.markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ children: [], spacing: { before: 30, after: 0 } }));
      continue;
    }

    // Table detection
    if (trimmed.includes("|") && i + 1 < lines.length) {
      const result = parseTableBlock(lines, i);
      if (result) {
        children.push(result.table);
        i = result.endIdx - 1;
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      children.push(new Paragraph({
        children: parseInlineRuns(trimmed.slice(2), 20),
        spacing: { before: 20, after: 70, line: 280 },
      }));
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: stripMarkdown(trimmed.slice(5)), size: 20, bold: true, color: "4B5563", font: DOC_FONT })],
        spacing: { before: 140, after: 60, line: 260 },
      }));
      continue;
    }
    if (trimmed.startsWith("### ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: stripMarkdown(trimmed.slice(4)), size: 22, bold: true, font: DOC_FONT, color: "1F2A37" })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 180, after: 70, line: 260 },
      }));
      continue;
    }
    if (trimmed.startsWith("## ")) {
      children.push(new Paragraph({
        children: [new TextRun({ text: stripMarkdown(trimmed.slice(3)), size: 26, bold: true, font: DOC_FONT, color: "1F2A37" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 90, line: 270 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6DEE7", space: 4 } },
      }));
      continue;
    }
    if (trimmed.startsWith("# ")) {
      if (stripMarkdown(trimmed.slice(2)) === title) continue;
      children.push(new Paragraph({
        children: [new TextRun({ text: stripMarkdown(trimmed.slice(2)), size: 30, bold: true, font: DOC_FONT, color: "1F2A37" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 260, after: 100, line: 280 },
      }));
      continue;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      children.push(new Paragraph({
        children: parseInlineRuns(trimmed.slice(2), 20),
        bullet: { level: 0 },
        spacing: { before: 25, after: 55, line: 280 },
      }));
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      children.push(new Paragraph({
        children: parseInlineRuns(numMatch[2], 20),
        numbering: { reference: "default-numbering", level: 0 },
        spacing: { before: 25, after: 55, line: 280 },
      }));
      continue;
    }

    children.push(new Paragraph({
      children: parseInlineRuns(trimmed, 20),
      spacing: { before: 0, after: 80, line: 280 },
    }));
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START }],
        },
      ],
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [...ops2EbitdaWordmarkRuns(20), new TextRun({ text: "    Atlas IQ", size: 18, font: DOC_FONT, color: "64748B" })],
            spacing: { after: 80 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6DEE7", space: 6 } },
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 16, font: DOC_FONT, color: "64748B" })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      children,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}
