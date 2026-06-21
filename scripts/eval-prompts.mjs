/**
 * AtlasIQ Prompt Evaluation Script
 *
 * Calls OpenRouter directly with the same system prompts used in production.
 * Scores outputs against a PE-specific rubric across depth, authenticity,
 * structure, and accuracy discipline.
 *
 * Usage: node scripts/eval-prompts.mjs [--mode chat|market|company|all] [--case N]
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

// Load .env.local manually
const envPath = resolve(PROJECT_ROOT, ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

// ── Config ───────────────────────────────────────────────────────────────────

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY not set. Add to .env.local");
  process.exit(1);
}

// ── Import prompts (inline to avoid TS compilation) ──────────────────────────

// We duplicate the prompts here to avoid needing tsx/ts-node.
// The eval script reads the current prompt file and extracts them.
const promptFile = readFileSync(
  resolve(PROJECT_ROOT, "lib/atlas/prompts.ts"),
  "utf-8"
);

function extractPrompt(varName) {
  const regex = new RegExp(
    `export const ${varName} = \`([\\s\\S]*?)\`;`,
    "m"
  );
  const match = promptFile.match(regex);
  if (!match) throw new Error(`Could not extract ${varName} from prompts.ts`);
  return match[1];
}

const CHAT_SYSTEM = extractPrompt("CHAT_SYSTEM_PROMPT");
const MARKET_SYSTEM = extractPrompt("MARKET_SYSTEM_PROMPT");
const COMPANY_SYSTEM = extractPrompt("COMPANY_SYSTEM_PROMPT");

// ── Test Cases ───────────────────────────────────────────────────────────────

const TEST_CASES = {
  chat: [
    {
      id: "chat-1-factual",
      name: "Factual: EBITDA definition",
      complexity: "factual",
      message: "What is EBITDA?",
      expect: {
        minWords: 30,
        maxWords: 200,
        mustContain: ["profitability", "multiple", "valuation"],
        mustNotContain: ["Great question", "I'd be happy"],
        noHeadings: true,
      },
    },
    {
      id: "chat-2-contextual",
      name: "Contextual: Customer concentration in PE",
      complexity: "contextual",
      message:
        "How do PE firms think about customer concentration risk when underwriting a deal?",
      expect: {
        minWords: 150,
        maxWords: 500,
        mustContain: ["concentration", "revenue", "multiple"],
        mustNotContain: ["Great question"],
        requireQuantification: true,
        requireSkepticism: true,
      },
    },
    {
      id: "chat-3-analytical",
      name: "Analytical: Behavioral health PE attractiveness",
      complexity: "analytical",
      message:
        "Evaluate behavioral health as a sector for PE investment. What makes it attractive and what are the key risks?",
      expect: {
        minWords: 400,
        maxWords: 1500,
        mustContain: ["margin", "fragmentation", "reimbursement"],
        requireHeadings: true,
        requireQuantification: true,
        requireSkepticism: true,
      },
    },
    {
      id: "chat-4-deepdive",
      name: "Deep-dive: Buy-and-build thesis for HVAC",
      complexity: "deep-dive",
      message:
        "Build a buy-and-build thesis for HVAC services. Include platform criteria, add-on logic, value creation levers, and key risks.",
      expect: {
        minWords: 800,
        maxWords: 3000,
        mustContain: ["platform", "add-on", "EBITDA", "multiple"],
        requireHeadings: true,
        requireTables: true,
        requireQuantification: true,
        requireSkepticism: true,
        requireDiligenceQs: true,
      },
    },
    {
      id: "chat-5-ambiguous",
      name: "Ambiguous: Fragmentation (should default UP)",
      complexity: "analytical",
      message: "Tell me about fragmentation in waste management.",
      expect: {
        minWords: 300,
        maxWords: 1500,
        mustContain: ["fragmentation"],
        requireQuantification: true,
        requireHeadings: true,
      },
    },
  ],

  market: [
    {
      id: "market-1",
      name: "Market report: Pest control",
      message: "Pest control services",
      sourceDigest: buildMockSourceDigest("pest control", [
        {
          title: "Pest Control Market Size & Growth",
          snippet:
            "The U.S. pest control market was valued at approximately $23 billion in 2024, growing at 5-6% CAGR. Rollins (ROL) and Rentokil-Terminix are the two largest players with combined ~25% market share. The remaining market is highly fragmented with 20,000+ operators, most under $5M revenue. Gross margins typically 50-55%, EBITDA margins 15-22% for scaled operators. Recurring revenue from subscription contracts ranges 70-85%. ABC Home & Commercial Services, HomeTeam Pest Defense, and Massey Services are notable regionals. Anticimex (EQT-backed) has been active in European consolidation. Private transaction multiples have ranged 10-14x EBITDA for quality platforms.",
        },
        {
          title: "Rollins Inc 2024 10-K Highlights",
          snippet:
            "Rollins reported $3.4B revenue, 21% EBITDA margin, 82% recurring revenue, and completed 30 acquisitions in 2024. Customer retention rate 83%. Average revenue per customer ~$620/year. Residential 45%, commercial 55% of revenue.",
        },
        {
          title: "PE Activity in Pest Control",
          snippet:
            "Recent sponsor activity includes ABC Home & Commercial (Cinven acquisition 2023 for reportedly $1.3B), Anticimex (EQT), and Aptive Environmental (growth equity). The sector attracts PE due to recurring revenue, low cyclicality, route density economics, and fragmentation enabling buy-and-build. Key risks include labor availability, chemical regulation changes, and customer acquisition costs in competitive metro markets.",
        },
      ]),
      expect: {
        minWords: 1500,
        requireAllSections: true,
        requireTables: true,
        requireQuantification: true,
        requireSkepticism: true,
        requireSourceAttribution: true,
      },
    },
  ],

  company: [
    {
      id: "company-1",
      name: "Company report: ABC Home & Commercial",
      message: "ABC Home & Commercial Services",
      sourceDigest: buildMockSourceDigest("ABC Home & Commercial Services", [
        {
          title: "ABC Home & Commercial Services Overview",
          snippet:
            "ABC Home & Commercial Services is a multi-brand home services platform headquartered in Dallas, TX. Services include pest control, lawn care, plumbing, electrical, and HVAC across 20+ states. Estimated revenue $250-400M. ~3,000 employees. Founded 1949. Acquired by Cinven in 2023 for a reported $1.3B. Previously backed by several PE sponsors including Harvest Partners.",
        },
        {
          title: "ABC Home Services Expansion",
          snippet:
            "ABC has completed 15+ tuck-in acquisitions since 2020, primarily in pest control and lawn care. The company operates under multiple local brands to maintain customer trust. Route density and cross-sell are primary value creation levers. Customer retention estimated at 80-85% for recurring service contracts.",
        },
        {
          title: "Home Services M&A Landscape",
          snippet:
            "Home services M&A has remained active with multiples of 10-15x EBITDA for quality platforms. Key buyers include Cinven (ABC), Roark Capital (ServiceMaster brands), and Goldman Sachs (Leaf Home). Fragmentation remains high with 100,000+ operators in pest/lawn/HVAC. Labor and customer acquisition are primary margin headwinds.",
        },
      ]),
      expect: {
        minWords: 1500,
        requireAllSections: true,
        requireTables: true,
        requireQuantification: true,
        requireSkepticism: true,
        requireSourceAttribution: true,
      },
    },
  ],
};

// ── Mock Source Digest Builder ────────────────────────────────────────────────

function buildMockSourceDigest(query, sources) {
  return sources
    .map((s, i) => {
      return [
        `[${i + 1}] ${s.title}`,
        `Type: tavily | Score: ${80 - i * 5} | Query: ${query}`,
        `URL: https://example.com/source-${i + 1}`,
        `Signal: context`,
        `Excerpt: ${s.snippet}`,
      ].join("\n");
    })
    .join("\n\n");
}

// ── Build user message for report modes ──────────────────────────────────────

function buildReportUserMessage(mode, testCase) {
  if (mode === "market") {
    return `Prepare a deep, source-backed PE-style market research report for: ${testCase.message}

Use only the source digest below. If evidence is thin, say so explicitly.
Write for a private equity analyst who needs to learn the industry and decide whether deeper sourcing/diligence is warranted.

Quality bar:
- Be specific and structured, not generic.
- Separate sourced facts from hypotheses.
- Include numbers only when supported by the source digest.
- Include directional benchmark estimates when evidence is incomplete, but label them as directional and state the source basis.
- Use bullets and compact tables where they improve scanability.
- Mention source strength and gaps. Current live source count: ${3}.

Required sections (use these exact headings):
# ${testCase.message} - PE Market Research Memo
## Executive Read
## Market Definition
## Segmentation
## Value Chain
## Why PE Cares
## Demand Drivers
## Business Model and Margin Characteristics
## Industry Metrics, KPIs, and Valuation Context
## Competitive Landscape
## Fragmentation and Buy-and-Build Potential
## M&A and Sponsor Activity
## Public Comps / Reference Companies
## Sponsor Thesis Angles
## Red Flags and Underwriting Risks
## Diligence Agenda
## What Would Change Our Mind
## Source Notes

Source digest:
${testCase.sourceDigest}

Benchmark section requirements:
- Start with this caveat or a close variant: "The following benchmarks are directional and based on available public sources, public-company comps, industry articles, and disclosed transaction commentary. They should be treated as underwriting inputs to validate in diligence, not definitive market data."
- Use a compact table with columns: Metric / KPI, Directional Range or Read, Source Basis, Diligence Implication.
- Include relevant KPIs such as gross margin, EBITDA margin, revenue growth, capex intensity, working-capital intensity, retention/churn/utilization/ARPU/take-rate where applicable, public-company valuation multiples, and reported private transaction multiple commentary when sourceable.
- If exact evidence is weak, provide a best directional read and label the source basis as weak evidence, adjacent-sector inference, public comps, industry article, operator benchmark, or reported deal commentary.`;
  }

  if (mode === "company") {
    return `Prepare a deep, source-backed PE-style private company research report for: ${testCase.message}

Use only the source digest below. If evidence is thin, say so explicitly.
Write for a lower-middle-market private equity analyst learning the business and deciding whether to keep digging.

Quality bar:
- Be specific and structured, not generic.
- Separate sourced facts from hypotheses.
- Include numbers, customers, owners, investors, and claims only when supported by the source digest.
- Use bullets and compact tables where they improve scanability.
- Mention source strength and gaps. Current live source count: ${3}.

Required sections (use these exact headings):
# ${testCase.message} - Private Company Research Memo
## Executive Read
## Business Overview
## Products and Services
## Customers and End Markets
## Market Positioning
## Competitive Landscape
## Ownership and News Signals
## Sponsor Fit
## Platform / Add-On Fit
## Value Creation Levers
## Red Flags and Underwriting Risks
## Diligence Agenda
## What Would Change Our Mind
## Source Notes

Source digest:
${testCase.sourceDigest}`;
  }

  return testCase.message;
}

// ── API Call ──────────────────────────────────────────────────────────────────

async function callModel(systemPrompt, userMessage, maxTokens = 8000) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://ops2ebitda.com",
      "X-Title": "AtlasIQ Eval",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Scoring ──────────────────────────────────────────────────────────────────

const PE_VOCABULARY = [
  "ebitda",
  "multiple",
  "platform",
  "add-on",
  "tuck-in",
  "bolt-on",
  "diligence",
  "underwriting",
  "sponsor",
  "fragmentation",
  "margin",
  "recurring revenue",
  "exit",
  "value creation",
  "buy-and-build",
  "roll-up",
  "ic ",
  "investment committee",
  "lbo",
  "leveraged",
  "portfolio company",
  "carry",
  "dry powder",
  "deal flow",
  "proprietary",
  "management rollover",
  "earnout",
  "quality of earnings",
  "customer concentration",
  "cyclicality",
  "thesis",
];

const SKEPTICISM_MARKERS = [
  "risk",
  "concern",
  "challenge",
  "headwind",
  "unclear",
  "unproven",
  "limited evidence",
  "needs diligence",
  "red flag",
  "caution",
  "downside",
  "counter",
  "skeptic",
  "question",
  "gap",
  "weakness",
  "threat",
  "pressure",
  "vulnerability",
  "fragile",
  "fear",
  "collapse",
  "penalize",
  "haircut",
  "compress",
  "stress-test",
  "overhang",
  "cliff event",
  "binary event",
  "pass unless",
  "too fragile",
  "cannot survive",
];

const QUANTIFICATION_PATTERNS = [
  /\d+%/,
  /\$[\d,.]+[BMK]?/i,
  /\d+x/,
  /\d+-\d+%/,
  /\$[\d,.]+-[\d,.]+/,
  /\d+\.\d+x/,
  /~\d+/,
  /\d{1,3}(,\d{3})+/,
  /\d+\s*(billion|million|thousand)/i,
  /cagr/i,
];

function scoreOutput(output, testCase, mode) {
  const text = output.toLowerCase();
  const words = output.split(/\s+/).length;
  const lines = output.split("\n");

  const scores = {
    depth: 0,
    peAuthenticity: 0,
    structure: 0,
    accuracyDiscipline: 0,
  };
  const findings = [];
  const expect = testCase.expect;

  // ── Depth (0-30) ──────────────────────────────────────────────────────

  // Word count in expected range
  if (expect.minWords && words < expect.minWords) {
    const deficit = ((expect.minWords - words) / expect.minWords) * 100;
    findings.push(
      `DEPTH: Too short. ${words} words vs ${expect.minWords} minimum (${deficit.toFixed(0)}% under)`
    );
    scores.depth += Math.max(0, 8 - deficit / 5);
  } else if (expect.maxWords && words > expect.maxWords) {
    findings.push(
      `DEPTH: Too long. ${words} words vs ${expect.maxWords} max`
    );
    scores.depth += 6;
  } else {
    scores.depth += 10;
  }

  // Second-order thinking — expanded markers to catch varied phrasing
  const secondOrder = [
    "because",
    "which means",
    "implication",
    "therefore",
    "as a result",
    "consequently",
    "this suggests",
    "the key question",
    "second-order",
    "downstream",
    "meaning that",
    "in practice",
    "the risk is",
    "the concern is",
    "this creates",
    "this drives",
    "this limits",
    "this enables",
    "this matters because",
    "the challenge is",
    "the upside is",
    "the downside is",
    "what this means",
    "the net effect",
    "mitigant",
    "the core question",
    "must prove",
    "needs proving",
    "leaves limited room",
    "compressing",
    "translates to",
    "drives",
  ];
  const soCount = secondOrder.filter((t) => text.includes(t)).length;
  scores.depth += Math.min(10, soCount * 2.5);
  if (soCount < 2 && (expect.minWords || 0) > 300) {
    findings.push(
      `DEPTH: Weak second-order thinking. Only ${soCount} causal/implication markers found`
    );
  }

  // Specificity: concrete examples, named companies, specific metrics
  const namedEntities =
    output.match(/\*\*[A-Z][a-zA-Z\s&,.'-]+\*\*/g)?.length || 0;
  // Also count unbolded named companies and specific terms
  const allNamedEntities = namedEntities +
    ((output.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/g) || []).length / 3);
  scores.depth += Math.min(10, allNamedEntities * 1.2);
  if (allNamedEntities < 2 && (expect.minWords || 0) > 300) {
    findings.push(
      `DEPTH: Low specificity. Only ${Math.round(allNamedEntities)} named entities`
    );
  }

  // Content density bonus — high quantification and PE terms relative to word count
  const quantPer100 = (QUANTIFICATION_PATTERNS.filter((p) => p.test(output)).length / words) * 100;
  if (quantPer100 > 1.5) scores.depth += 3;

  // ── PE Authenticity (0-25) ─────────────────────────────────────────────

  const peTermCount = PE_VOCABULARY.filter((t) => text.includes(t)).length;
  // Scale PE vocab expectations to response length — factual answers won't load 10 PE terms
  const expectedPeTerms = words < 150 ? 2 : words < 400 ? 4 : 6;
  scores.peAuthenticity += Math.min(15, peTermCount * (words < 150 ? 3 : 1.5));
  if (peTermCount < expectedPeTerms) {
    findings.push(
      `PE AUTH: Low PE vocabulary density. ${peTermCount} terms used (expected ${expectedPeTerms}+ for ${words}w response)`
    );
  }

  // Chatbot phrases (negative)
  const chatbotPhrases = [
    "great question",
    "i'd be happy",
    "certainly",
    "absolutely",
    "let me help",
    "here's what",
    "i hope this helps",
    "feel free to ask",
    "don't hesitate",
    "glad you asked",
    "interesting question",
  ];
  const botCount = chatbotPhrases.filter((p) => text.includes(p)).length;
  if (botCount > 0) {
    scores.peAuthenticity -= botCount * 3;
    findings.push(
      `PE AUTH: Chatbot language detected: ${chatbotPhrases.filter((p) => text.includes(p)).join(", ")}`
    );
  } else {
    scores.peAuthenticity += 5;
  }

  // Skepticism
  if (expect.requireSkepticism) {
    const skepticCount = SKEPTICISM_MARKERS.filter((t) =>
      text.includes(t)
    ).length;
    scores.peAuthenticity += Math.min(5, skepticCount);
    if (skepticCount < 3) {
      findings.push(
        `PE AUTH: Insufficient skepticism. Only ${skepticCount} risk/concern markers`
      );
    }
  }

  // ── Structure (0-25) ──────────────────────────────────────────────────

  // Headings
  const h3Count = lines.filter((l) => l.match(/^###\s/)).length;
  const h2Count = lines.filter((l) => l.match(/^##\s/)).length;
  const h1Count = lines.filter((l) => l.match(/^#\s[^#]/)).length;

  if (expect.requireHeadings && h3Count === 0 && h2Count === 0) {
    findings.push("STRUCT: No headings found when expected");
  } else if (expect.requireHeadings) {
    scores.structure += 5;
  }

  if (expect.noHeadings && (h3Count > 0 || h2Count > 0 || h1Count > 0)) {
    findings.push("STRUCT: Headings used when not expected for factual answer");
    scores.structure -= 3;
  } else if (expect.noHeadings) {
    scores.structure += 5;
  }

  // Required sections (report modes)
  if (expect.requireAllSections) {
    const requiredSections =
      mode === "market"
        ? [
            "Executive Read",
            "Market Definition",
            "Segmentation",
            "Value Chain",
            "Demand Drivers",
            "Business Model",
            "Competitive Landscape",
            "Fragmentation",
            "M&A",
            "Comps",
            "Sponsor Thesis",
            "Red Flags",
            "Diligence Agenda",
            "What Would Change",
            "Source Notes",
          ]
        : [
            "Executive Read",
            "Business Overview",
            "Products and Services",
            "Customers",
            "Market Positioning",
            "Competitive Landscape",
            "Ownership",
            "Sponsor Fit",
            "Platform",
            "Value Creation",
            "Red Flags",
            "Diligence Agenda",
            "What Would Change",
            "Source Notes",
          ];

    const found = requiredSections.filter((s) =>
      text.includes(s.toLowerCase())
    );
    const missing = requiredSections.filter(
      (s) => !text.includes(s.toLowerCase())
    );
    const sectionScore = (found.length / requiredSections.length) * 10;
    scores.structure += sectionScore;
    if (missing.length > 0) {
      findings.push(`STRUCT: Missing sections: ${missing.join(", ")}`);
    }
  }

  // Tables
  const tableCount = (output.match(/\|.*\|.*\|/g) || []).length;
  if (expect.requireTables && tableCount < 3) {
    findings.push(`STRUCT: Only ${tableCount} table rows. Expected tables`);
  } else if (expect.requireTables) {
    scores.structure += 5;
  }

  // Bullets — scale reward by response length tier
  const bulletCount = lines.filter((l) => l.match(/^\s*[-*]\s/)).length;
  const isShortResponse = words < 500;
  // Short responses get more credit per bullet since they won't have headings/tables
  if (isShortResponse) {
    scores.structure += Math.min(10, bulletCount * 2);
  } else {
    scores.structure += Math.min(5, bulletCount / 3);
  }

  // Bold usage — same scaling
  const boldCount = (output.match(/\*\*[^*]+\*\*/g) || []).length;
  if (isShortResponse) {
    scores.structure += Math.min(10, boldCount * 1.5);
  } else {
    scores.structure += Math.min(5, boldCount / 2);
  }

  // Bold lead-in bullets (PE format: "- **Phrase.** Detail..." or "- **Phrase:** Detail...")
  const boldLeadBullets = lines.filter((l) =>
    l.match(/^\s*[-*]\s\*\*[^*]+[.*:]\*\*\s+\S/)
  ).length;
  scores.structure += Math.min(5, boldLeadBullets * 1.5);

  // Em dash check
  const emDashCount = (output.match(/—/g) || []).length;
  if (emDashCount > 0) {
    findings.push(
      `STRUCT: ${emDashCount} em dashes found (prompt says don't use them)`
    );
    scores.structure -= Math.min(3, emDashCount);
  }

  // Bullet-as-heading anti-pattern
  const bulletHeadings = lines.filter(
    (l) =>
      l.match(/^\s*[-*]\s\*\*[^*]+\*\*\.?\s*$/) &&
      !l.match(/^\s*[-*]\s\*\*[^*]+\*\*\s+\S/)
  ).length;
  if (bulletHeadings > 0) {
    findings.push(
      `STRUCT: ${bulletHeadings} bullets used as group labels (should be ### sub-headings)`
    );
    scores.structure -= Math.min(5, bulletHeadings);
  }

  // ── Accuracy Discipline (0-20) ─────────────────────────────────────────

  // Quantification
  if (expect.requireQuantification) {
    const quantCount = QUANTIFICATION_PATTERNS.filter((p) =>
      p.test(output)
    ).length;
    scores.accuracyDiscipline += Math.min(8, quantCount * 1.5);
    if (quantCount < 3) {
      findings.push(
        `ACCURACY: Weak quantification. Only ${quantCount} numeric patterns`
      );
    }
  }

  // Source attribution (report modes)
  if (expect.requireSourceAttribution) {
    const sourceRefs =
      (output.match(/source/gi) || []).length +
      (output.match(/evidence/gi) || []).length +
      (output.match(/reported/gi) || []).length;
    scores.accuracyDiscipline += Math.min(6, sourceRefs);
    if (sourceRefs < 3) {
      findings.push(
        `ACCURACY: Weak source attribution. Only ${sourceRefs} source/evidence references`
      );
    }
  }

  // Diligence questions
  if (expect.requireDiligenceQs) {
    const dqCount = (text.match(/diligence/g) || []).length;
    const questionMarks = (output.match(/\?/g) || []).length;
    if (questionMarks < 3) {
      findings.push(
        `ACCURACY: Only ${questionMarks} questions posed. Expected diligence questions`
      );
    } else {
      scores.accuracyDiscipline += 3;
    }
  }

  // Hypothesis vs fact discipline — reward distinguishing language
  const disciplineMarkers = [
    "directional",
    "estimated",
    "approximate",
    "reportedly",
    "suggests",
    "hypothesis",
    "unconfirmed",
    "limited data",
    "thin evidence",
    "needs verification",
    "diligence required",
    "to be validated",
    "source basis",
    "weak evidence",
    "based on",
    "typically",
    "generally",
    "in practice",
    "most sponsors",
    "often",
    "tends to",
  ];
  const disciplineCount = disciplineMarkers.filter((t) => text.includes(t)).length;
  scores.accuracyDiscipline += Math.min(6, disciplineCount * 1.5);

  // Practical wisdom bonus — chat responses that demonstrate PE judgment patterns
  const practicalWisdom = [
    "stress-test",
    "underwrite",
    "model must",
    "deal structure",
    "covenant",
    "leverage",
    "equity story",
    "exit multiple",
    "entry multiple",
    "earnout",
    "rollover",
    "haircut",
  ];
  const wisdomCount = practicalWisdom.filter((t) => text.includes(t)).length;
  scores.accuracyDiscipline += Math.min(4, wisdomCount);

  // Must contain / must not contain
  if (expect.mustContain) {
    const missing = expect.mustContain.filter((t) => !text.includes(t.toLowerCase()));
    if (missing.length > 0) {
      findings.push(`CONTENT: Missing expected terms: ${missing.join(", ")}`);
      scores.accuracyDiscipline -= missing.length;
    } else {
      scores.accuracyDiscipline += 3;
    }
  }

  if (expect.mustNotContain) {
    const found = expect.mustNotContain.filter((t) => text.includes(t.toLowerCase()));
    if (found.length > 0) {
      findings.push(`CONTENT: Contains prohibited phrases: ${found.join(", ")}`);
      scores.peAuthenticity -= found.length * 3;
    }
  }

  // Normalize scores to 0-100
  const raw = {
    depth: Math.max(0, Math.min(30, scores.depth)),
    peAuthenticity: Math.max(0, Math.min(25, scores.peAuthenticity)),
    structure: Math.max(0, Math.min(25, scores.structure)),
    accuracyDiscipline: Math.max(0, Math.min(20, scores.accuracyDiscipline)),
  };

  const total = raw.depth + raw.peAuthenticity + raw.structure + raw.accuracyDiscipline;

  return {
    scores: raw,
    total,
    wordCount: words,
    findings,
    grade: total >= 80 ? "A" : total >= 65 ? "B" : total >= 50 ? "C" : total >= 35 ? "D" : "F",
  };
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function runTestCase(mode, testCase) {
  const systemPrompt =
    mode === "market"
      ? MARKET_SYSTEM
      : mode === "company"
        ? COMPANY_SYSTEM
        : CHAT_SYSTEM;

  const userMessage = buildReportUserMessage(mode, testCase);
  const maxTokens = mode === "chat" ? 8000 : 16000;

  console.log(`  Running: ${testCase.name}...`);

  const startTime = Date.now();
  const output = await callModel(systemPrompt, userMessage, maxTokens);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(
    `  Done (${elapsed}s, ${output.split(/\s+/).length} words)`
  );

  const result = scoreOutput(output, testCase, mode);

  return {
    ...result,
    id: testCase.id,
    name: testCase.name,
    mode,
    complexity: testCase.complexity,
    elapsed: parseFloat(elapsed),
    output,
  };
}

async function runMode(mode) {
  const cases = TEST_CASES[mode];
  if (!cases || cases.length === 0) {
    console.log(`No test cases for mode: ${mode}`);
    return [];
  }

  console.log(`\n═══ ${mode.toUpperCase()} MODE (${cases.length} cases) ═══`);
  const results = [];

  for (const tc of cases) {
    const result = await runTestCase(mode, tc);
    results.push(result);
  }

  return results;
}

// ── Report ───────────────────────────────────────────────────────────────────

function generateReport(allResults) {
  const lines = [];
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  lines.push(`# AtlasIQ Prompt Evaluation Report`);
  lines.push(`Model: ${MODEL}`);
  lines.push(`Date: ${timestamp}`);
  lines.push(``);

  // Summary table
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(
    `| Case | Mode | Grade | Total | Depth | PE Auth | Structure | Accuracy | Words | Time |`
  );
  lines.push(
    `|------|------|-------|-------|-------|---------|-----------|----------|-------|------|`
  );

  for (const r of allResults) {
    lines.push(
      `| ${r.name} | ${r.mode} | **${r.grade}** | ${r.total.toFixed(1)} | ${r.scores.depth.toFixed(1)}/30 | ${r.scores.peAuthenticity.toFixed(1)}/25 | ${r.scores.structure.toFixed(1)}/25 | ${r.scores.accuracyDiscipline.toFixed(1)}/20 | ${r.wordCount} | ${r.elapsed}s |`
    );
  }

  // Averages
  const avg = (key) =>
    (allResults.reduce((sum, r) => sum + r.scores[key], 0) / allResults.length).toFixed(1);
  const avgTotal = (
    allResults.reduce((sum, r) => sum + r.total, 0) / allResults.length
  ).toFixed(1);

  lines.push(``);
  lines.push(
    `**Averages:** Total ${avgTotal}/100 | Depth ${avg("depth")}/30 | PE Auth ${avg("peAuthenticity")}/25 | Structure ${avg("structure")}/25 | Accuracy ${avg("accuracyDiscipline")}/20`
  );
  lines.push(``);

  // Detailed findings
  lines.push(`## Detailed Findings`);
  lines.push(``);

  for (const r of allResults) {
    lines.push(`### ${r.name} (${r.mode}) — ${r.grade} (${r.total.toFixed(1)}/100)`);
    lines.push(``);
    if (r.findings.length === 0) {
      lines.push(`- No issues found`);
    } else {
      for (const f of r.findings) {
        lines.push(`- ${f}`);
      }
    }
    lines.push(``);
  }

  // Full outputs
  lines.push(`## Full Outputs`);
  lines.push(``);

  for (const r of allResults) {
    lines.push(`### ${r.id}: ${r.name}`);
    lines.push(``);
    lines.push(`<details><summary>Full output (${r.wordCount} words)</summary>`);
    lines.push(``);
    lines.push(r.output);
    lines.push(``);
    lines.push(`</details>`);
    lines.push(``);
  }

  return lines.join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const modeArg =
    args.find((a) => a.startsWith("--mode="))?.split("=")[1] || "all";
  const caseArg = args.find((a) => a.startsWith("--case="))?.split("=")[1];

  const modes =
    modeArg === "all" ? ["chat", "market", "company"] : [modeArg];

  console.log(`AtlasIQ Prompt Eval`);
  console.log(`Model: ${MODEL}`);
  console.log(`Modes: ${modes.join(", ")}`);

  const allResults = [];

  for (const mode of modes) {
    let cases = TEST_CASES[mode];
    if (caseArg) {
      cases = cases?.filter((_, i) => i === parseInt(caseArg) - 1);
    }
    if (!cases || cases.length === 0) continue;

    // Temporarily override TEST_CASES for filtered run
    const origCases = TEST_CASES[mode];
    TEST_CASES[mode] = cases;
    const results = await runMode(mode);
    TEST_CASES[mode] = origCases;
    allResults.push(...results);
  }

  if (allResults.length === 0) {
    console.log("No results. Check mode/case args.");
    return;
  }

  // Generate and save report
  const report = generateReport(allResults);
  const outputDir = resolve(PROJECT_ROOT, "output");
  mkdirSync(outputDir, { recursive: true });

  const filename = `eval-${modeArg}-${Date.now()}.md`;
  const outputPath = resolve(outputDir, filename);
  writeFileSync(outputPath, report);

  console.log(`\n═══ RESULTS ═══`);
  for (const r of allResults) {
    console.log(
      `  ${r.grade} ${r.total.toFixed(1)}/100 — ${r.name} (${r.wordCount}w, ${r.elapsed}s)`
    );
    if (r.findings.length > 0) {
      for (const f of r.findings) {
        console.log(`    ⚠ ${f}`);
      }
    }
  }

  const avgTotal = (
    allResults.reduce((sum, r) => sum + r.total, 0) / allResults.length
  ).toFixed(1);
  console.log(`\n  Average: ${avgTotal}/100`);
  console.log(`  Report: ${outputPath}`);
}

main().catch((err) => {
  console.error("Eval failed:", err);
  process.exit(1);
});
