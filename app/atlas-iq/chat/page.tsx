import type { Metadata } from "next";
import { AtlasChat } from "@/components/AtlasChat";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Atlas IQ Chat",
  description: "PE research intelligence for market analysis, company evaluation, and operating insights.",
  path: "/atlas-iq/chat",
});

export default function AtlasIQChatPage() {
  return <AtlasChat fullPage />;
}
