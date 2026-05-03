export const aiNavLinks = [
  { href: "/ai-for-pe-professionals", label: "Start Here" },
  { href: "/ai-for-pe-professionals/use-cases", label: "Top Use Cases" },
  {
    href: "/ai-for-pe-professionals/guardrails",
    label: "Guardrails & Data Security",
  },
  { href: "/ai-for-pe-professionals/tool-landscape", label: "Tool Landscape" },
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
    title: "Outside-in diligence synthesis",
    stakeholder: "Investment team, operating partner, diligence consultant",
    value:
      "Moves faster from document overload to a first operating view of the target.",
    inputs:
      "CIM, management presentation, expert-call notes, public filings, customer reviews, competitor pages, prior deal notes.",
    workflow:
      "Create a deal project, load the source pack, ask the model to build an issue tree, extract operating claims, separate facts from assumptions, and list diligence questions by function.",
    output:
      "A sharper management-meeting guide, risk register, data-request list, and first-pass value creation hypotheses.",
    caution:
      "Use it to find questions and patterns, not to replace primary diligence or source verification.",
  },
  {
    title: "IC memo pressure testing",
    stakeholder: "Associate, VP, principal, investment committee prep lead",
    value:
      "Improves memo quality by finding weak claims before the committee does.",
    inputs:
      "Draft IC memo, diligence findings, underwriting assumptions, market notes, Q&A log, management responses.",
    workflow:
      "Ask the model to read like a skeptical IC member: identify unsupported claims, missing evidence, unclear risk ownership, and places where operating logic does not connect to valuation.",
    output:
      "A punch list of memo edits, diligence follow-ups, downside scenarios, and cleaner investment-thesis language.",
    caution:
      "The model can over-polish a weak thesis. Keep the critique grounded in actual evidence.",
  },
  {
    title: "Board update and portfolio narrative drafting",
    stakeholder: "Operating partner, portfolio ops team, CFO support",
    value:
      "Turns monthly reporting into a better discussion of what changed, why it changed, and what should happen next.",
    inputs:
      "KPI pack, budget variance, CEO notes, prior board deck, action tracker, sales pipeline, margin bridge.",
    workflow:
      "Use a project with the board format and prior examples, then ask for a plain-English operating narrative organized by wins, misses, leading indicators, decisions needed, and follow-up questions.",
    output:
      "A draft board narrative, issue list, management questions, and follow-up agenda.",
    caution:
      "Finance and KPI math still need human review. AI is best at narrative structure and question generation.",
  },
  {
    title: "KPI root-cause diagnosis",
    stakeholder: "Operating partner, portfolio analyst, functional leader",
    value:
      "Helps a team move from observing a metric miss to forming testable hypotheses.",
    inputs:
      "Metric definitions, monthly results, segment detail, pipeline data, customer cohorts, SKU data, labor or procurement data.",
    workflow:
      "Use a diagnostic skill to force the model to separate symptom, likely cause, data needed, operating lever, value impact, and next management question.",
    output:
      "An issue tree, data-request list, likely causes, and proposed operating interventions.",
    caution:
      "AI should suggest hypotheses. It should not pretend it has proven root cause without data.",
  },
  {
    title: "Expert call and management meeting synthesis",
    stakeholder: "Deal team, diligence lead, consultant",
    value:
      "Finds recurring themes, contradictions, and open questions across messy transcript material.",
    inputs:
      "Expert call transcripts, interview notes, prepared questions, thesis notes, market map.",
    workflow:
      "Load transcripts into a source-grounded workspace and ask for themes by diligence topic, contradictory evidence, quotes to revisit, and implications for underwriting.",
    output:
      "A synthesis memo, quote bank, contradiction log, and follow-up question set.",
    caution:
      "Transcripts can be noisy. Ask the model to cite speaker/source and avoid over-weighting one anecdote.",
  },
  {
    title: "Market mapping and white-space research",
    stakeholder: "Origination, strategy, investment team",
    value:
      "Accelerates the early map of a market before the team spends expensive human hours on deeper work.",
    inputs:
      "Target description, industry keywords, competitor names, customer segments, trade associations, public company comps.",
    workflow:
      "Use web research tools to build a rough market map, then ask for segments, competitors, value-chain roles, demand drivers, red flags, and sources to verify.",
    output:
      "A starter market map, competitor table, diligence angles, and source list.",
    caution:
      "AI research can miss private companies and niche terminology. Treat the output as a starting map.",
  },
  {
    title: "Portfolio monitoring and early-warning summaries",
    stakeholder: "Portfolio ops team, deal team, CFO, board prep owner",
    value:
      "Surfaces emerging issues earlier by comparing repeated updates in a consistent format.",
    inputs:
      "Monthly KPI packs, action trackers, covenant reporting, pipeline updates, customer churn notes, margin bridges.",
    workflow:
      "Create a recurring project that compares current-period updates to prior months and asks for changes in trend, tone, risk, and management follow-through.",
    output:
      "Early-warning memo, open-action tracker, watchlist, and board-prep questions.",
    caution:
      "The data model matters. Bad metric definitions or inconsistent reporting will limit the value.",
  },
  {
    title: "Value creation plan drafting",
    stakeholder: "Operating partner, investment team, management team",
    value:
      "Converts diligence findings into an initial operating agenda faster.",
    inputs:
      "Diligence workstreams, KPI baseline, management priorities, org chart, synergy model, first-100-days template.",
    workflow:
      "Ask the model to group opportunities by workstream, assign likely owners, identify quick wins versus hard changes, and tie each lever to EBITDA, cash, risk, or growth.",
    output:
      "Draft 100-day plan, workstream list, owner map, KPI dashboard outline, and first data requests.",
    caution:
      "Management buy-in and operating feasibility are still human work.",
  },
];

export const guardrailPractices = [
  {
    title: "Use enterprise or approved business accounts",
    body: "Consumer AI accounts are usually the wrong place for deal data. Enterprise and business products typically add admin controls, contractual terms, training protections, auditability, and support paths that a free account will not provide.",
  },
  {
    title: "Write the AI policy in normal business language",
    body: "The policy should say what data can be used, which tools are approved, when redaction is required, who can upload data-room material, and what outputs need human review.",
  },
  {
    title: "Put AI terms into contracts and engagement letters",
    body: "For consultants, vendors, advisors, and portfolio company teams, add provisions covering approved tools, confidential information, client data, model training, retention, subcontractors, audit rights, and breach notification. Legal counsel should own the final language.",
  },
  {
    title: "Use source-grounded workflows for sensitive work",
    body: "For diligence and board work, prefer tools that can cite the source file or passage behind a claim. This makes the output easier to review and less likely to become unsupported narrative.",
  },
  {
    title: "Separate confidential data from public research",
    body: "Use public web tools for market mapping and source discovery. Use approved enterprise workspaces or secure deal platforms for confidential CIMs, transcripts, board decks, financials, and data-room exports.",
  },
  {
    title: "Keep permissions boring and strict",
    body: "Role-based access, least privilege, MFA, document permissions, logging, and retention controls matter more than clever prompts. AI should inherit strong access controls, not bypass them.",
  },
];

export const toolLandscape = [
  {
    name: "Claude Projects and Skills",
    opinion: "Best default for reusable AI skill workflows.",
    bestFor:
      "Reusable skill.md workflows, long-form reasoning, structured diligence support, writing and rewriting operating narratives, and project-based work with source context.",
    limitations:
      "Teams still need an enterprise setup, clear data policy, and review discipline. Claude is not a diligence database by itself.",
    source: "https://support.claude.com/en/articles/12512176-what-are-skills",
  },
  {
    name: "ChatGPT Projects and GPTs",
    opinion: "Strong general-purpose workspace, less direct for portable skills.",
    bestFor:
      "General research, project workspaces, brainstorming, drafting, analysis support, and custom assistants with instructions and files.",
    limitations:
      "Can approximate skill behavior, but does not map as naturally to portable skill.md-style folders.",
    source: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt",
  },
  {
    name: "NotebookLM",
    opinion: "Best for source-grounded study of a document set.",
    bestFor:
      "CIMs, transcripts, strategy decks, public research packs, management notes, and fast source-grounded synthesis.",
    limitations:
      "Better as a research notebook than a reusable workflow system.",
    source:
      "https://support.google.com/notebooklm/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en",
  },
  {
    name: "Perplexity Spaces",
    opinion: "Best for external market research and source discovery.",
    bestFor:
      "Market scans, competitor research, source finding, public-company context, industry primers, and white-space mapping.",
    limitations:
      "Less suited for confidential internal data unless the firm has approved the setup.",
    source:
      "https://www.perplexity.ai/help-center/en/articles/10352961-what-are-spaces",
  },
  {
    name: "Microsoft 365 Copilot Agents",
    opinion: "Best when the firm already runs on Microsoft 365.",
    bestFor:
      "Enterprise search, internal document workflows, SharePoint context, permissions-aware knowledge work, and firm-managed agents.",
    limitations:
      "The quality depends heavily on tenant hygiene, permissions, and how well the firm has organized its files.",
    source:
      "https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build",
  },
  {
    name: "Gemini Gems and Workspace Gemini",
    opinion: "Useful for lightweight saved assistants and Google-native teams.",
    bestFor:
      "Saved task styles, Google Workspace users, document support, email and productivity workflows, and simple recurring assistants.",
    limitations:
      "Less compelling than Claude for structured PE skill packages.",
    source: "https://support.google.com/gemini/answer/15236321?hl=en",
  },
  {
    name: "AI-enabled data rooms and diligence platforms",
    opinion: "Best when the workflow starts inside a controlled data room.",
    bestFor:
      "Large data-room review, permissioned Q&A, redaction, document summaries, secure buyer/seller collaboration, and audit trails.",
    limitations:
      "Often narrower and more expensive than general AI tools, but better aligned with sensitive transaction material.",
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
    label: "Anthropic data processor guidance",
    href: "https://support.anthropic.com/en/articles/9267385-does-anthropic-act-as-a-data-processor-or-controller",
  },
  {
    label: "Microsoft 365 Copilot data security",
    href: "https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-privacy?azure-portal=true",
  },
  {
    label: "Intralinks DealCentre AI overview",
    href: "https://support.intralinks.com/hc/en-us/articles/13607163211163-Overview-DealCentre-AI",
  },
];
