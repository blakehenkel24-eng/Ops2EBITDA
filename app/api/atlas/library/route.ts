import { searchOperatingLibrary } from "@/lib/atlas/library";

export async function POST(req: Request) {
  const { query, limit = 5 } = await req.json();
  const chunks = await searchOperatingLibrary(query, limit);
  return Response.json({ chunks });
}
