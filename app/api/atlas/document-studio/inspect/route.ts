import { NextResponse } from "next/server";
import { DocxInspectionError, inspectDocx } from "@/lib/atlas/docx-inspection";
import { isDocxFilename, MAX_DOCX_BYTES, SAMPLE_FRAMEWORKS } from "@/lib/atlas/document-studio";

export const runtime = "nodejs";
export const maxDuration = 30;
const MAX_MULTIPART_BYTES = MAX_DOCX_BYTES + 256 * 1024;
const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 10;
const MAX_CONCURRENT_INSPECTIONS = 2;
const requestWindows = new Map<string, { count: number; startedAt: number }>();
let activeInspections = 0;

function safeFilename(name: string) {
  const basename = name.split(/[\\/]/).pop() ?? "document.docx";
  return basename.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 180) || "document.docx";
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Document Studio inspection is not enabled" }, { status: 404 });
  }
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : null;
  if (contentLength !== null && (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > MAX_MULTIPART_BYTES)) {
    return NextResponse.json({ error: "Request body must be a valid DOCX upload smaller than 15 MB" }, { status: 413 });
  }
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const window = requestWindows.get(client);
  if (!window || now - window.startedAt >= WINDOW_MS) requestWindows.set(client, { count: 1, startedAt: now });
  else if (window.count >= REQUESTS_PER_WINDOW) return NextResponse.json({ error: "Too many inspection requests" }, { status: 429 });
  else window.count += 1;
  if (activeInspections >= MAX_CONCURRENT_INSPECTIONS) {
    return NextResponse.json({ error: "Document inspection is busy. Try again shortly." }, { status: 503 });
  }

  activeInspections += 1;
  try {
    const form = await request.formData();
    const file = form.get("file");
    const frameworkId = form.get("frameworkId");
    if (!(file instanceof File) || typeof frameworkId !== "string") {
      return NextResponse.json({ error: "file and frameworkId are required" }, { status: 400 });
    }
    if (!SAMPLE_FRAMEWORKS.some((framework) => framework.id === frameworkId)) {
      return NextResponse.json({ error: "Choose a valid framework" }, { status: 400 });
    }
    if (!isDocxFilename(file.name)) return NextResponse.json({ error: "Only .docx files are supported" }, { status: 400 });
    if (file.size === 0 || file.size > MAX_DOCX_BYTES) {
      return NextResponse.json({ error: "DOCX must be between 1 byte and 15 MB" }, { status: 413 });
    }
    const inspection = inspectDocx({
      bytes: new Uint8Array(await file.arrayBuffer()),
      filename: safeFilename(file.name),
      frameworkId: frameworkId as "buy-side" | "mutual",
    });
    return NextResponse.json({ inspection });
  } catch (error) {
    const status = error instanceof DocxInspectionError ? error.status : 400;
    const message = error instanceof DocxInspectionError ? error.message : "Document inspection failed";
    return NextResponse.json({ error: message }, { status });
  } finally {
    activeInspections -= 1;
  }
}
