import { NextResponse } from "next/server";
import { insertDocument, setDocumentDigest, uploadToStorage } from "@/lib/atlas/deal";
import { extractPdfText, digestDocumentText } from "@/lib/atlas/digest";

export const maxDuration = 120;

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const dealId = form.get("dealId");
  const docType = (form.get("docType") as string) || null;

  if (!(file instanceof File) || typeof dealId !== "string") {
    return NextResponse.json({ error: "file and dealId are required" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF uploads are supported" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const storagePath = `${dealId}/${Date.now()}-${file.name}`;

  const stored = await uploadToStorage(storagePath, bytes, "application/pdf");
  if (!stored) return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });

  const doc = await insertDocument({
    deal_id: dealId, filename: file.name, doc_type: docType,
    storage_path: storagePath, byte_size: bytes.byteLength,
  });
  if (!doc) return NextResponse.json({ error: "Could not record document" }, { status: 500 });

  try {
    const text = await extractPdfText(bytes);
    const digest = await digestDocumentText(docType ?? "doc", text);
    await setDocumentDigest(doc.id, digest, "ready");
    return NextResponse.json({ document: { ...doc, digest, status: "ready" } });
  } catch (err) {
    await setDocumentDigest(doc.id, null, "failed");
    const message = err instanceof Error ? err.message : "Digest failed";
    return NextResponse.json({ document: { ...doc, status: "failed" }, error: message }, { status: 200 });
  }
}
