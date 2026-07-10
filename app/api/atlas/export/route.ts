import { generateMemoPdf, generateMemoDocx } from "@/lib/atlas/export";
import type { ResearchMemo } from "@/lib/atlas/types";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "pdf";
  const memo: ResearchMemo = await req.json();

  if (format === "docx") {
    const docxBuffer = await generateMemoDocx(memo);
    return new Response(docxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="atlas-iq-${memo.mode}-${Date.now()}.docx"`,
      },
    });
  }

  const pdfBuffer = generateMemoPdf(memo);
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="atlas-iq-${memo.mode}-${Date.now()}.pdf"`,
    },
  });
}
