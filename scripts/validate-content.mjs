import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const scopedPages = {
  fundamental: [
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
  playbook: [
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

const requiredFields = {
  fundamental: {
    strings: ["slug", "title", "summary", "type", "definition", "whyItMatters", "example", "diagram"],
    arrays: ["relatedPlaybooks", "relatedIndustries"],
  },
  playbook: {
    strings: [
      "slug",
      "title",
      "summary",
      "type",
      "category",
      "difficulty",
      "definition",
      "whyItMatters",
      "ebitdaLogic",
      "caseExample",
      "diagram",
    ],
    arrays: [
      "commonProblems",
      "diagnosticQuestions",
      "dataNeeded",
      "process",
      "kpisImpacted",
      "hundredDayPlan",
      "commonMistakes",
      "relatedIndustries",
      "relatedProjectPlaybooks",
    ],
  },
};

const violations = [];

function report(relativePath, message) {
  violations.push(`${relativePath}: ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function authoredStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(authoredStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(authoredStrings);
  return [];
}

function countWords(paragraphs) {
  return paragraphs
    .filter(isNonEmptyString)
    .flatMap((paragraph) => paragraph.trim().split(/\s+/u))
    .filter(Boolean).length;
}

function validateRequiredFields(page, expectedType, relativePath) {
  const fields = requiredFields[expectedType];

  for (const field of fields.strings) {
    if (!isNonEmptyString(page[field])) {
      report(relativePath, `required field "${field}" must be a non-empty string`);
    }
  }

  for (const field of fields.arrays) {
    if (!Array.isArray(page[field])) {
      report(relativePath, `required field "${field}" must be an array`);
      continue;
    }

    page[field].forEach((value, index) => {
      if (!isNonEmptyString(value)) {
        report(relativePath, `required field "${field}[${index}]" must be a non-empty string`);
      }
    });
  }

  if (page.type !== expectedType) {
    report(relativePath, `required field "type" must be "${expectedType}"`);
  }

  if (expectedType === "playbook" && !["Beginner", "Intermediate", "Advanced"].includes(page.difficulty)) {
    report(relativePath, 'required field "difficulty" must be Beginner, Intermediate, or Advanced');
  }
}

function validateArticleSections(page, relativePath) {
  if (!Array.isArray(page.articleSections) || page.articleSections.length !== 5) {
    const count = Array.isArray(page.articleSections) ? page.articleSections.length : 0;
    report(relativePath, `articleSections must contain exactly 5 sections (found ${count})`);
  }

  if (!Array.isArray(page.articleSections)) return;

  const titles = new Set();
  const paragraphs = [];
  let hasCallout = false;

  page.articleSections.forEach((section, index) => {
    const label = `articleSections[${index}]`;
    if (!section || typeof section !== "object" || Array.isArray(section)) {
      report(relativePath, `${label} must be an object`);
      return;
    }

    if (!isNonEmptyString(section.title)) {
      report(relativePath, `${label}.title must be a non-empty string`);
    } else {
      const normalizedTitle = section.title.trim().toLocaleLowerCase("en-US");
      if (titles.has(normalizedTitle)) {
        report(relativePath, `${label}.title duplicates another section title: "${section.title.trim()}"`);
      }
      titles.add(normalizedTitle);
    }

    if (!Array.isArray(section.body) || section.body.length !== 3) {
      const count = Array.isArray(section.body) ? section.body.length : 0;
      report(relativePath, `${label}.body must contain exactly 3 paragraphs (found ${count})`);
    }

    if (Array.isArray(section.body)) {
      section.body.forEach((paragraph, paragraphIndex) => {
        if (!isNonEmptyString(paragraph)) {
          report(relativePath, `${label}.body[${paragraphIndex}] must be a non-empty string`);
        }
      });
      paragraphs.push(...section.body);
    }

    if (isNonEmptyString(section.callout)) hasCallout = true;
  });

  const wordCount = countWords(paragraphs);
  if (wordCount < 1_050) {
    report(relativePath, `article section bodies must contain at least 1050 words (found ${wordCount})`);
  }
  if (!hasCallout) {
    report(relativePath, "at least one article section must have a non-empty callout");
  }
}

function validateDiagrams(page, relativePath) {
  const hasCompleteDiagram =
    Array.isArray(page.diagrams) &&
    page.diagrams.some(
      (diagram) =>
        diagram &&
        typeof diagram === "object" &&
        !Array.isArray(diagram) &&
        isNonEmptyString(diagram.title) &&
        isNonEmptyString(diagram.description) &&
        isNonEmptyString(diagram.chart),
    );

  if (!hasCompleteDiagram) {
    report(relativePath, "diagrams must contain at least one entry with non-empty title, description, and chart");
  }
}

async function validatePage(expectedType, slug) {
  const directory = expectedType === "fundamental" ? "fundamentals" : "playbooks";
  const relativePath = path.posix.join("content", directory, `${slug}.json`);
  const absolutePath = path.join(root, relativePath);
  let source;

  try {
    source = await readFile(absolutePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      report(relativePath, "file is missing");
    } else {
      report(relativePath, `could not read file: ${error.message}`);
    }
    return;
  }

  let page;
  try {
    page = JSON.parse(source);
  } catch (error) {
    report(relativePath, `invalid JSON: ${error.message}`);
    return;
  }

  if (!page || typeof page !== "object" || Array.isArray(page)) {
    report(relativePath, "top-level JSON value must be an object");
    return;
  }

  if (page.slug !== slug) {
    report(relativePath, `slug must be "${slug}" (found ${JSON.stringify(page.slug)})`);
  }
  if (`${page.slug}.json` !== path.basename(relativePath)) {
    report(relativePath, `filename must match slug as "${page.slug}.json"`);
  }

  validateRequiredFields(page, expectedType, relativePath);
  validateArticleSections(page, relativePath);
  validateDiagrams(page, relativePath);

  if (authoredStrings(page).some((value) => /\b(?:TBD|TODO|FIXME)\b/iu.test(value))) {
    report(relativePath, "authored page content must not contain TBD, TODO, or FIXME tokens");
  }
}

for (const [expectedType, slugs] of Object.entries(scopedPages)) {
  for (const slug of slugs) {
    await validatePage(expectedType, slug);
  }
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Validated 19 upgraded content pages.");
}
