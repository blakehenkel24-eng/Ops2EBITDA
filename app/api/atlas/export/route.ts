import { generateMemoPdf } from "@/lib/atlas/export";
import type { ResearchMemo } from "@/lib/atlas/types";

export async function POST(req: Request) {
  const memo: ResearchMemo = await req.json();
  const pdfBuffer = generateMemoPdf(memo);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="atlas-iq-${memo.mode}-${Date.now()}.pdf"`,
    },
  });
}
