import { NextResponse } from "next/server";
import {
  DealServiceError,
  deleteStorageObjects,
  insertDocument,
  isUuid,
  setDocumentDigest,
  uploadToStorage,
} from "@/lib/atlas/deal";
import { extractPdfText, digestDocumentText } from "@/lib/atlas/digest";
import { MAX_PDF_BYTES } from "@/lib/atlas/deal-upload";

export const maxDuration = 120;

function safeFilename(name: string): string {
  const basename = name.split(/[\\/]/).pop() ?? "document.pdf";
  const cleaned = basename
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .replace(/\.{2,}/g, ".")
    .trim()
    .slice(0, 180);
  return cleaned && cleaned !== "." ? cleaned : "document.pdf";
}

function isPdf(bytes: Uint8Array): boolean {
  return bytes.length >= 5
    && bytes[0] === 0x25
    && bytes[1] === 0x50
    && bytes[2] === 0x44
    && bytes[3] === 0x46
    && bytes[4] === 0x2d;
}

function serviceError(error: unknown) {
  const status = error instanceof DealServiceError ? error.status : 500;
  const message = error instanceof DealServiceError ? error.message : "Deal document request failed";
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
  }
  const file = form.get("file");
  const dealId = form.get("dealId");
  const rawDocType = form.get("docType");
  const docType = typeof rawDocType === "string" && rawDocType.trim() ? rawDocType.trim() : null;

  if (!(file instanceof File) || typeof dealId !== "string") {
    return NextResponse.json({ error: "file and dealId are required" }, { status: 400 });
  }
  if (!isUuid(dealId)) {
    return NextResponse.json({ error: "Invalid dealId" }, { status: 400 });
  }
  if (docType && (docType.length > 80 || !/^[a-zA-Z0-9 _-]+$/.test(docType))) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF uploads are supported" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: `PDF must be between 1 byte and ${MAX_PDF_BYTES} bytes` }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isPdf(bytes)) {
    return NextResponse.json({ error: "File content is not a valid PDF" }, { status: 400 });
  }
  const filename = safeFilename(file.name);
  const storagePath = `${dealId}/${crypto.randomUUID()}-${filename}`;

  try {
    const stored = await uploadToStorage(storagePath, bytes, "application/pdf");
    if (!stored) return NextResponse.json({ error: "Storage upload failed" }, { status: 502 });

    let doc;
    try {
      doc = await insertDocument({
        deal_id: dealId, filename, doc_type: docType,
        storage_path: storagePath, byte_size: bytes.byteLength,
      });
    } catch (error) {
      await deleteStorageObjects([storagePath]);
      throw error;
    }
    if (!doc) {
      await deleteStorageObjects([storagePath]);
      return NextResponse.json({ error: "Could not record document" }, { status: 502 });
    }

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
  } catch (error) {
    return serviceError(error);
  }
}
