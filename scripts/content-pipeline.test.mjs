import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ops2ebitda-content-pipeline-"));
const scopedPages = {
  fundamentals: [
    "100-day-plan",
    "board-governance-in-pe",
    "debt-covenants-and-lender-reporting",
    "exit-readiness",
    "investment-committee-process",
    "management-equity-plans",
    "platform-vs-add-on-strategy",
    "purchase-price-mechanics",
    "quality-of-earnings",
    "working-capital-in-private-equity",
  ],
  playbooks: [
    "customer-concentration-reduction",
    "debt-covenant-recovery-plan",
    "erp-systems-consolidation",
    "management-equity-rollout",
    "margin-leakage-diagnostic",
    "quality-of-earnings-preparation",
    "revenue-operations-cleanup",
    "sales-compensation-redesign",
    "sku-rationalization",
  ],
};

function readPage(directory, slug, base = root) {
  const filePath = path.join(base, "content", directory, `${slug}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

try {
  const authoredContent = new Map();
  for (const [directory, slugs] of Object.entries(scopedPages)) {
    for (const slug of slugs) {
      const page = readPage(directory, slug);
      authoredContent.set(`${directory}/${slug}`, {
        articleSections: page.articleSections,
        diagram: page.diagram,
        diagrams: page.diagrams,
      });
    }
  }

  fs.cpSync(path.join(root, "scripts"), path.join(temporaryRoot, "scripts"), { recursive: true });
  fs.cpSync(path.join(root, "content"), path.join(temporaryRoot, "content"), { recursive: true });

  const sentinelPath = path.join(temporaryRoot, "external-sentinel.json");
  const sentinelContents = "registered content must not follow this symlink\n";
  const registeredPath = path.join(
    temporaryRoot,
    "content",
    "fundamentals",
    "what-private-equity-is.json",
  );
  fs.writeFileSync(sentinelPath, sentinelContents);
  fs.rmSync(registeredPath);
  fs.symlinkSync(sentinelPath, registeredPath);

  execFileSync(process.execPath, ["scripts/generate-content.mjs"], { cwd: temporaryRoot });

  const authoredDiagramPath = path.join(
    temporaryRoot,
    "content",
    "fundamentals",
    "deal-lifecycle.json",
  );
  const authoredDiagrams = [
    {
      title: "Authored deal lifecycle",
      description: "A deliberately authored diagram that enrichment must preserve.",
      chart: "flowchart LR\n  Thesis --> Exit",
    },
  ];
  const registeredPage = JSON.parse(fs.readFileSync(authoredDiagramPath, "utf8"));
  registeredPage.diagrams = authoredDiagrams;
  fs.writeFileSync(authoredDiagramPath, `${JSON.stringify(registeredPage, null, 2)}\n`);

  execFileSync(process.execPath, ["scripts/enrich-content.mjs"], { cwd: temporaryRoot });

  assert.equal(fs.readFileSync(sentinelPath, "utf8"), sentinelContents);
  assert.equal(fs.lstatSync(registeredPath).isSymbolicLink(), false);
  assert.deepEqual(readPage("fundamentals", "deal-lifecycle", temporaryRoot).diagrams, authoredDiagrams);

  for (const [directory, slugs] of Object.entries(scopedPages)) {
    for (const slug of slugs) {
      const filePath = path.join(temporaryRoot, "content", directory, `${slug}.json`);
      assert.ok(fs.existsSync(filePath), `${directory}/${slug}.json should still exist`);

      const page = readPage(directory, slug, temporaryRoot);
      const expected = authoredContent.get(`${directory}/${slug}`);
      assert.deepEqual(page.articleSections, expected.articleSections);
      if (Array.isArray(expected.diagrams) && expected.diagrams.length > 0) {
        assert.deepEqual(page.diagrams, expected.diagrams);
      } else {
        assert.equal(page.diagrams.length, 1);
        assert.ok(page.diagrams[0].title.trim().length > 0);
        assert.ok(page.diagrams[0].description.trim().length > 0);
        assert.equal(page.diagrams[0].chart, expected.diagram);
      }
    }
  }

  console.log("Content pipeline preserved 19 hand-authored pages.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
