export const aiNavLinks = [
  { href: "/ai-for-pe-professionals", label: "Start Here" },
  { href: "/ai-for-pe-professionals/use-cases", label: "Top Use Cases" },
  { href: "/ai-for-pe-professionals/tool-landscape", label: "Tool Landscape" },
  {
    href: "/ai-for-pe-professionals/guardrails",
    label: "Guardrails & Data Security",
  },
];

export const projectExample = [
  {
    label: "Sources you add",
    body: "CIM, management presentation, call transcript, KPI definitions, old board deck, diligence notes, and the firm's preferred memo format.",
  },
  {
    label: "Instructions you write",
    body: "Act like a PE operating advisor. Use only the provided sources. Separate facts from assumptions. Flag missing data. End with management questions and a one-page operating implication summary.",
  },
  {
    label: "Repeatable output",
    body: "Every time you add new materials, the project can produce the same kind of output: questions, risks, upside hypotheses, data requests, and executive-ready summaries.",
  },
];

export const differences = [
  {
    item: "Normal chat",
    simpleMeaning: "A one-off conversation.",
    example: "Ask: summarize this transcript.",
  },
  {
    item: "AI project",
    simpleMeaning: "A reusable folder or workroom for one workflow.",
    example:
      "A diligence project that remembers the files, rules, examples, and desired output format for that deal.",
  },
  {
    item: "AI skill",
    simpleMeaning:
      "A reusable checklist or method the AI follows. In Claude-style workflows, this is often written as a skill.md file.",
    example:
      "A KPI diagnostic skill that always separates symptoms, likely causes, data needed, and EBITDA impact.",
  },
];

export const skillExamples = [
  {
    name: "KPI diagnostic skill",
    description:
      "Takes a metric miss and turns it into likely causes, missing data, management questions, and possible EBITDA or cash impact.",
  },
  {
    name: "IC memo pressure-test skill",
    description:
      "Reviews a draft investment memo for unsupported claims, vague operating logic, missing diligence, and unclear downside risks.",
  },
  {
    name: "Board update writer skill",
    description:
      "Turns KPI packs, CEO notes, and action trackers into a clearer board narrative: what changed, why it matters, and what needs a decision.",
  },
  {
    name: "Diligence question builder skill",
    description:
      "Uses a CIM, market notes, and thesis assumptions to draft sharper questions for management, experts, customers, or functional leaders.",
  },
];

export const useCases = [
  {
    title: "Diligence compression",
    stakeholder: "Deal teams, operating partners, diligence advisors",
    take:
      "The highest-confidence use case is not replacing diligence. It is getting from a messy source pack to the first real issue tree faster.",
    inputs:
      "CIM, management deck, Q&A log, expert-call transcripts, customer notes, industry research, public filings, KPI definitions.",
    workflow:
      "Load the source set, force the model to separate evidence from assumptions, then ask for an issue tree by commercial, operational, financial, technology, and management diligence angle.",
    payoff:
      "A better first meeting guide, cleaner data request list, faster transcript synthesis, and fewer obvious gaps making it to the partner review.",
    examples: [
      "Turn a CIM and management deck into a diligence issue tree.",
      "Compare five expert calls and isolate agreement, disagreement, and underwriting implications.",
      "Extract every management claim that still needs proof.",
      "Draft management meeting questions by function and by risk theme.",
    ],
  },
  {
    title: "Investment judgment support",
    stakeholder: "Associates, VPs, principals, IC prep leads",
    take:
      "AI is useful when it plays the skeptical reviewer: not deciding whether to invest, but finding where the argument is soft.",
    inputs:
      "Draft IC memo, investment thesis, model assumptions, diligence findings, downside case, market notes, partner comments.",
    workflow:
      "Ask it to read like the toughest IC member in the room: identify unsupported claims, circular logic, missing risks, valuation leaps, and places where the operating plan does not connect to the model.",
    payoff:
      "A tighter memo, sharper risk framing, better downside cases, and a clearer list of diligence still required before signing.",
    examples: [
      "Pressure-test the investment thesis against the evidence actually provided.",
      "Translate diligence findings into IC-ready risks and mitigants.",
      "Find the model assumptions that need operating proof.",
      "Rewrite a vague thesis into specific value drivers, milestones, and evidence requirements.",
    ],
  },
  {
    title: "Portfolio signal intelligence",
    stakeholder: "Operating partners, portfolio ops, CFO support teams",
    take:
      "The value is turning recurring reporting into a stronger operating signal: what changed, why it matters, and what deserves management attention.",
    inputs:
      "Monthly KPI packs, budget variance, sales pipeline, churn data, margin bridge, action tracker, CEO notes, prior board decks.",
    workflow:
      "Use the same review structure every month: trend changes, leading indicators, root-cause hypotheses, open actions, decisions needed, and questions for management.",
    payoff:
      "Cleaner board prep, faster issue spotting, better follow-through on open actions, and a more consistent view across portfolio companies.",
    examples: [
      "Summarize a KPI pack into board-level operating themes.",
      "Compare this month to the prior three updates and flag changes in trend or tone.",
      "Turn CFO notes into a tighter margin, cash, and growth narrative.",
      "Create an early-warning memo for churn, pipeline quality, working capital, or covenant pressure.",
    ],
  },
  {
    title: "Value creation operating leverage",
    stakeholder: "Operating partners, functional advisors, management teams",
    take:
      "AI helps most when the firm already has a point of view on how value is created. It can turn that point of view into repeatable operating playbooks.",
    inputs:
      "Diligence findings, KPI baseline, functional playbooks, org chart, customer cohorts, pricing files, procurement data, sales process notes.",
    workflow:
      "Use AI to structure the workstream: baseline, hypotheses, data needed, operating levers, owner map, 30/60/90-day actions, and EBITDA or cash linkage.",
    payoff:
      "A faster first draft of the value creation plan and better reuse of firm expertise across similar situations.",
    examples: [
      "Build a 100-day plan from diligence notes and management priorities.",
      "Create a pricing, procurement, sales productivity, or working capital workstream plan.",
      "Convert an operating partner's checklist into a reusable project template.",
      "Identify where AI itself can reduce cost or cycle time inside a portfolio company.",
    ],
  },
  {
    title: "Origination and market mapping",
    stakeholder: "Business development, investment teams, strategy teams",
    take:
      "AI will not create proprietary deal flow by itself, but it can make thesis research and market mapping much less manual.",
    inputs:
      "Investment criteria, known targets, competitor names, trade associations, founder-led company lists, web research, CRM notes, conference lists.",
    workflow:
      "Start with a thesis, then ask AI tools to expand the universe, classify companies, explain why each fits or does not fit, and identify source evidence to verify.",
    payoff:
      "Faster theme development, better long lists, cleaner market maps, and more targeted outreach preparation.",
    examples: [
      "Map niche verticals where traditional databases are incomplete.",
      "Find lookalike companies based on business model, customer type, and operating signals.",
      "Draft thesis-specific outreach angles from public company evidence.",
      "Summarize market structure before a banker meeting or conference.",
    ],
  },
  {
    title: "Firm knowledge reuse",
    stakeholder: "Investment teams, portfolio teams, platform leaders",
    take:
      "The underappreciated use case is institutional memory. PE firms repeat patterns, but the knowledge is often buried in old memos, decks, diligence folders, and partner comments.",
    inputs:
      "Prior IC memos, board decks, investment theses, diligence reports, playbooks, operating templates, portfolio case studies.",
    workflow:
      "Create approved repositories and retrieval workflows so teams can ask, 'where have we seen this before?' without manually searching old folders.",
    payoff:
      "Better reuse of prior work, faster onboarding, stronger pattern recognition, and less dependence on whoever remembers the last similar deal.",
    examples: [
      "Pull precedent risks from prior deals in the same sector.",
      "Find old board narratives that handled similar KPI patterns.",
      "Create a house-style memo assistant grounded in prior approved examples.",
      "Summarize firm playbooks into reusable workflows for analysts and operating partners.",
    ],
  },
];

export const guardrailPractices = [
  {
    title: "Use enterprise accounts for enterprise data",
    body: "The security posture changes materially when a firm uses approved business or enterprise accounts. Look for contractual commitments, admin controls, SSO, MFA, audit logs, role-based access, retention settings, and clear language on whether customer content is used for model training.",
  },
  {
    title: "Classify tools by data sensitivity",
    body: "A practical policy does not need to be long. Define which tools can handle public research, internal operating documents, data-room exports, board materials, customer data, employee data, and legal material. Then make the approved path easy to follow.",
  },
  {
    title: "Put AI use into legal documents",
    body: "Engagement letters, NDAs, vendor agreements, portfolio company policies, and consultant SOWs can address approved tools, confidential information, data retention, model training, subprocessors, audit rights, breach notification, and human review obligations.",
  },
  {
    title: "Prefer source-grounded workflows",
    body: "For diligence, board work, and investment memos, outputs should cite the file, transcript, or passage behind material claims. Source grounding makes review faster and reduces the chance that polished language turns into unsupported conviction.",
  },
  {
    title: "Keep permissions attached to the content",
    body: "The best AI deployments inherit existing permissions from Microsoft 365, Google Workspace, Slack, data rooms, or internal repositories. If a user should not see a document normally, AI should not surface it through search or chat.",
  },
  {
    title: "Govern the workflow, not just the model",
    body: "Prompt rules are not governance. The operating model should define approved use cases, data classes, review requirements, output labeling, escalation paths, and who owns the policy as tools and contracts change.",
  },
];

export const toolLandscape = [
  {
    name: "Claude",
    category: "General enterprise AI workspace",
    opinion: "Best default for serious PE knowledge work.",
    bestFor:
      "Long-context synthesis, structured reasoning, writing quality, reusable Projects, artifacts, and repeatable workflows. Claude is the tool I would push hardest for operating partners and deal professionals who want one primary AI workspace.",
    whyUse:
      "It is especially strong at turning messy materials into clean judgment support: issue trees, memo rewrites, board narratives, diligence questions, and operating plans. Claude Skills also make it the cleanest home for reusable workflow files when a firm wants repeatability.",
    limitations:
      "It is not a financial database, expert network, data room, or CRM. The firm still needs approved enterprise setup, source discipline, and human review.",
    source: "https://claude.com/pricing/enterprise",
  },
  {
    name: "ChatGPT",
    category: "General enterprise AI workspace",
    opinion: "Best broad platform, especially where OpenAI is already approved.",
    bestFor:
      "General analysis, brainstorming, drafting, data work, custom GPTs, Projects, app integrations, and broad enterprise adoption. It is often the easiest tool to roll out because people already know how to use it.",
    whyUse:
      "Use ChatGPT when you want a flexible horizontal AI layer across the firm, especially for analysts and associates who need a fast generalist for research, drafting, spreadsheet thinking, and workflow experimentation.",
    limitations:
      "It can support repeatable assistants, but Claude is cleaner for reusable skill-style operating methods. For PE-specific content, ChatGPT still needs strong source context and firm rules.",
    source: "https://openai.com/index/business-data",
  },
  {
    name: "NotebookLM",
    category: "Source-grounded research notebook",
    opinion: "Best for studying a fixed source pack.",
    bestFor:
      "CIMs, transcripts, strategy decks, public research packs, diligence notes, and source-grounded Q&A. It is excellent when the question is, 'what do these documents say?'",
    whyUse:
      "Use it as a reading room. The product shines when the source boundary matters and the user wants fast synthesis, citation-backed answers, briefing documents, and study-style outputs from a defined notebook.",
    limitations:
      "It is less compelling as a firmwide workflow engine. It helps you understand sources, but it will not replace a full diligence platform, data room, or operating playbook system.",
    source:
      "https://support.google.com/a/answer/15706919?hl=en-VI&ref_topic=13853688",
  },
  {
    name: "Perplexity",
    category: "External research and source discovery",
    opinion: "Best for fast public-market and web research.",
    bestFor:
      "Market scans, competitor research, source discovery, industry primers, and public-company context. It is useful when the answer should start with current external sources rather than internal files.",
    whyUse:
      "Use it at the beginning of a market map or diligence sprint to find sources, terminology, competitors, and public evidence. It is a research accelerator, not a private-market truth machine.",
    limitations:
      "Private company coverage will be uneven, and confidential work should stay inside approved enterprise workflows.",
    source:
      "https://www.perplexity.ai/help-center/en/articles/10352973-what-is-enterprise-pro",
  },
  {
    name: "Microsoft 365 Copilot",
    category: "Enterprise productivity and internal knowledge",
    opinion: "Best if the firm lives in Microsoft.",
    bestFor:
      "SharePoint, Teams, Outlook, Word, Excel, PowerPoint, internal document search, and permissions-aware productivity workflows.",
    whyUse:
      "Use it when the firm wants AI inside the existing Microsoft estate rather than another standalone destination. Its biggest advantage is proximity to the work people already do.",
    limitations:
      "Quality depends on tenant hygiene. Bad permissions, duplicate files, stale folders, and inconsistent naming will show up in the AI experience.",
    source:
      "https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build",
  },
  {
    name: "Gemini for Workspace",
    category: "Google-native productivity",
    opinion: "Useful for Google-native firms, but not my first PE default.",
    bestFor:
      "Gmail, Docs, Sheets, Slides, Drive, and Google-native productivity. NotebookLM also gives Google a strong source-grounded research angle.",
    whyUse:
      "Use it when the firm already runs on Google Workspace and wants AI inside that permission and admin environment.",
    limitations:
      "For PE professionals choosing one primary AI product, I would still favor Claude for reasoning, writing, and reusable workflows.",
    source: "https://support.google.com/gemini/answer/15236321?hl=en",
  },
  {
    name: "Hebbia",
    category: "AI diligence and document workflow platform",
    opinion: "Best known for high-stakes document-heavy financial workflows.",
    bestFor:
      "Data-room review, diligence synthesis, investment research, agentic workflows, and structured analysis across large volumes of documents.",
    whyUse:
      "Use Hebbia when the pain is not 'I need a chatbot,' but 'I need a finance-oriented AI system that can work through a large diligence corpus with traceability and repeatable process.'",
    limitations:
      "It is a specialized platform, so cost and workflow fit matter. It should be evaluated against the firm's actual diligence volume and process maturity.",
    source: "https://www.hebbia.com/blog/private-equity-ai",
  },
  {
    name: "Onyx",
    category: "Enterprise search and internal AI layer",
    opinion: "Best for firms that want an internal knowledge layer they can control.",
    bestFor:
      "Enterprise search, internal knowledge Q&A, RAG, connectors, permission-aware retrieval, and AI access across firm systems.",
    whyUse:
      "Use Onyx when the problem is fragmented firm knowledge: old decks, Slack, Drive, SharePoint, CRM notes, and operational documents scattered across systems.",
    limitations:
      "It is infrastructure-like. The value depends on implementation, connectors, permissions, and ongoing knowledge hygiene.",
    source: "https://onyx.app/search",
  },
  {
    name: "AlphaSense",
    category: "Market intelligence and expert transcript search",
    opinion: "Best for premium market intelligence and external research depth.",
    bestFor:
      "Public-company research, broker research, earnings transcripts, expert calls, news, competitive intelligence, and thematic market work.",
    whyUse:
      "Use AlphaSense when external content coverage matters more than flexible workflow design. It is a research platform first, not a general operating-partner workspace.",
    limitations:
      "It can be expensive and will not replace internal firm context, data rooms, or custom operating workflows.",
    source: "https://www.alpha-sense.com/",
  },
  {
    name: "S&P Capital IQ Pro AI",
    category: "Financial data and market intelligence",
    opinion: "Best when AI needs to sit on top of trusted market data.",
    bestFor:
      "Company data, financials, filings, transcripts, private markets data, market intelligence, and AI-assisted research inside Capital IQ Pro.",
    whyUse:
      "Use it when the answer must connect to an institutional data platform. For many investment teams, the advantage is not the AI alone, it is AI plus trusted S&P data.",
    limitations:
      "It is strongest inside the S&P ecosystem. It is not the place to run custom operating workflows across a firm's own deal materials.",
    source:
      "https://www.spglobal.com/market-intelligence/en/solutions/artificial-intelligence/professional-services-ai-solutions",
  },
  {
    name: "PitchBook",
    category: "Private-market data",
    opinion: "Best for verified private-market data access.",
    bestFor:
      "Private companies, investors, funds, deals, valuation context, financing history, ownership, and market mapping.",
    whyUse:
      "Use PitchBook when the question depends on structured private-market data rather than open web search. The ChatGPT integration also makes it easier to query that data from an AI workflow.",
    limitations:
      "It is data infrastructure, not a replacement for diligence synthesis or portfolio operating work.",
    source: "https://openai.com/business/apps/pitchbook/",
  },
  {
    name: "Grata",
    category: "Private-company sourcing and market mapping",
    opinion: "Best for founder-led and private-company discovery.",
    bestFor:
      "Deal sourcing, niche market mapping, private-company discovery, thesis lists, and outreach preparation.",
    whyUse:
      "Use Grata when the team is trying to define a private-company universe that traditional databases may under-cover.",
    limitations:
      "AI can improve discovery, but it does not verify owner willingness, relationship warmth, or proprietary access.",
    source: "https://grata.com/ai",
  },
  {
    name: "FactSet Mercury and Dealmakers AI",
    category: "Financial data, banking, and deal workflow",
    opinion: "Strong for firms already standardized on FactSet.",
    bestFor:
      "Market data, banking workflows, pitch creation, document ingest, and AI-assisted research inside the FactSet ecosystem.",
    whyUse:
      "Use it when the firm already relies on FactSet and wants AI in the same research and dealmaking environment.",
    limitations:
      "Like S&P, the advantage is ecosystem depth. It is less relevant if the firm needs a flexible general AI workspace or custom PE operating toolkit.",
    source: "https://investor.factset.com/node/18036/pdf",
  },
  {
    name: "AI-enabled data rooms",
    category: "Transaction control layer",
    opinion: "Best when sensitive transaction material should stay in the data room.",
    bestFor:
      "Large document review, permissioned Q&A, summaries, redaction, buyer-seller workflows, audit trails, and secure collaboration.",
    whyUse:
      "Use data-room AI when the workflow begins with confidential transaction documents and the permission model matters as much as the summary quality.",
    limitations:
      "These tools are narrower than general AI workspaces, but the control environment can be exactly the point.",
    source:
      "https://support.intralinks.com/hc/en-us/articles/13607163211163-Overview-DealCentre-AI",
  },
];

export const sourceLinks = [
  {
    label: "McKinsey: Gen AI for outside-in diligence",
    href: "https://www.mckinsey.com/capabilities/transformation/our-insights/from-potential-to-performance-using-gen-ai-to-conduct-outside-in-diligence",
  },
  {
    label: "McKinsey: Gen AI in private markets",
    href: "https://www.mckinsey.com/industries/private-capital/our-insights/harnessing-the-power-of-gen-ai-in-private-markets",
  },
  {
    label: "McKinsey: 2026 private equity report",
    href: "https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report/private-equity",
  },
  {
    label: "BCG: Inside the AI-first PE firm",
    href: "https://www.bcg.com/publications/2026/inside-the-ai-first-private-equity-firm",
  },
  {
    label: "Bain: Generative AI in M&A",
    href: "https://www.bain.com/insights/generative-ai-m-and-a-report-2025/",
  },
  {
    label: "Bain: Generative AI in Private Equity",
    href: "https://www.bain.com/insights/field-notes-from-generative-ai-insurgency-global-private-equity-report-2025/",
  },
  {
    label: "PwC: GenAI for PE investment teams",
    href: "https://www.pwc.com/gx/en/industries/private-equity/genai-pivate-equity-principal-investors.html",
  },
  {
    label: "OpenAI business data privacy",
    href: "https://openai.com/index/business-data",
  },
  {
    label: "Claude Enterprise",
    href: "https://claude.com/pricing/enterprise",
  },
  {
    label: "Anthropic data processor guidance",
    href: "https://support.anthropic.com/en/articles/9267385-does-anthropic-act-as-a-data-processor-or-controller",
  },
  {
    label: "Google Workspace Gemini Privacy Hub",
    href: "https://support.google.com/a/answer/15706919?hl=en-VI&ref_topic=13853688",
  },
  {
    label: "Microsoft 365 Copilot data security",
    href: "https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-privacy?azure-portal=true",
  },
  {
    label: "Onyx enterprise search",
    href: "https://onyx.app/search",
  },
  {
    label: "Hebbia: AI in private equity",
    href: "https://www.hebbia.com/blog/private-equity-ai",
  },
  {
    label: "AlphaSense market intelligence",
    href: "https://www.alpha-sense.com/",
  },
  {
    label: "S&P Capital IQ Pro AI",
    href: "https://www.spglobal.com/market-intelligence/en/solutions/artificial-intelligence/professional-services-ai-solutions",
  },
  {
    label: "PitchBook in ChatGPT",
    href: "https://openai.com/business/apps/pitchbook/",
  },
  {
    label: "Grata AI deal sourcing",
    href: "https://grata.com/ai",
  },
  {
    label: "FactSet AI pitch creator",
    href: "https://investor.factset.com/node/18036/pdf",
  },
  {
    label: "Intralinks DealCentre AI overview",
    href: "https://support.intralinks.com/hc/en-us/articles/13607163211163-Overview-DealCentre-AI",
  },
];
