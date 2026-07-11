"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  FileCheck2,
  FileText,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import {
  reviewIsComplete,
  SAMPLE_FRAMEWORKS,
  type DocumentInspection,
  type FindingDecision,
  type SampleFramework,
  validateDocxFile,
} from "@/lib/atlas/document-studio";

type IntakeState = "idle" | "drag-valid" | "drag-invalid" | "ready" | "processing" | "success" | "error";
const steps = ["Select framework", "Add NDA", "Review findings", "Legal review"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DocumentStudio({ onBack }: { onBack: () => void }) {
  const [frameworkId, setFrameworkId] = useState<SampleFramework["id"] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [intakeState, setIntakeState] = useState<IntakeState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [inspection, setInspection] = useState<DocumentInspection | null>(null);
  const [decisions, setDecisions] = useState<Record<string, FindingDecision>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);

  useEffect(() => { headingRef.current?.focus(); }, []);

  const resetResults = () => {
    setInspection(null);
    setDecisions({});
  };

  const chooseFramework = (id: SampleFramework["id"]) => {
    if (intakeState === "processing") return;
    setFrameworkId(id);
    setError(null);
    resetResults();
  };

  const chooseFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    const validationError = validateDocxFile(nextFile);
    resetResults();
    if (validationError) {
      setFile(null);
      setError(validationError);
      setIntakeState("error");
      return;
    }
    setFile(nextFile);
    setError(null);
    setIntakeState("ready");
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setIntakeState("idle");
    resetResults();
    if (inputRef.current) inputRef.current.value = "";
    requestAnimationFrame(() => dropRef.current?.focus());
  };

  const inspect = async () => {
    if (!file || !frameworkId) return;
    setError(null);
    setIntakeState("processing");
    resetResults();
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("frameworkId", frameworkId);
      const response = await fetch("/api/atlas/document-studio/inspect", { method: "POST", body: form });
      const payload = await response.json() as { inspection?: DocumentInspection; error?: string };
      if (!response.ok || !payload.inspection) throw new Error(payload.error || "Atlas could not inspect this document");
      setInspection(payload.inspection);
      setIntakeState("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Atlas could not inspect this document");
      setIntakeState("error");
    }
  };

  const fileDrag = (event: React.DragEvent) => event.dataTransfer.types.includes("Files");
  const onDragEnter = (event: React.DragEvent) => {
    if (!fileDrag(event) || intakeState === "processing") return;
    event.preventDefault();
    dragDepth.current += 1;
    const candidate = event.dataTransfer.items[0];
    const invalid = event.dataTransfer.items.length !== 1 || (candidate?.type && candidate.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    setIntakeState(invalid ? "drag-invalid" : "drag-valid");
  };
  const onDragOver = (event: React.DragEvent) => {
    if (!fileDrag(event) || intakeState === "processing") return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIntakeState(file ? "ready" : "idle");
  };
  const onDrop = (event: React.DragEvent) => {
    if (!fileDrag(event) || intakeState === "processing") return;
    event.preventDefault();
    dragDepth.current = 0;
    if (event.dataTransfer.files.length !== 1) {
      setError("Drop one Word .docx file at a time.");
      setIntakeState("error");
      return;
    }
    chooseFile(event.dataTransfer.files[0]);
  };

  const stepIndex = inspection ? 2 : file ? 1 : 0;
  const selectedFramework = SAMPLE_FRAMEWORKS.find((framework) => framework.id === frameworkId);
  const reviewComplete = inspection ? reviewIsComplete(inspection.findings, decisions) : false;

  return (
    <main className="document-studio" aria-labelledby="document-studio-title">
      <div className="document-studio__topbar">
        <button type="button" className="document-studio__back" onClick={onBack}><ArrowLeft size={15} /> Back to Atlas navigation</button>
        <span className="document-studio__prototype">Private preview</span>
      </div>

      <div className="document-studio__content">
        <header className="document-studio__hero">
          <div className="document-studio__mark"><FileText size={22} /></div>
          <p className="document-studio__eyebrow">Atlas IQ · Document Studio</p>
          <h1 id="document-studio-title" ref={headingRef} tabIndex={-1}>Review an inbound NDA</h1>
          <p>Apply a framework to the actual Word document, review grounded clause findings, and prepare the next legal-review step.</p>
          <div className="document-studio__notice"><ShieldCheck size={16} /> Files are processed in memory for this preview and are not saved to the document library. Legal review remains required.</div>
        </header>

        <ol className="document-studio__steps" aria-label="NDA workflow steps">
          {steps.map((step, index) => <li key={step} className={index <= stepIndex ? "is-current" : ""}><span>{index + 1}</span>{step}</li>)}
        </ol>

        <section className="document-studio__section" aria-labelledby="framework-heading">
          <div className="document-studio__section-heading">
            <div><p className="document-studio__eyebrow">Step 1</p><h2 id="framework-heading">Select review framework</h2></div>
            <span>Sample policy</span>
          </div>
          <div className="document-studio__frameworks">
            {SAMPLE_FRAMEWORKS.map((framework) => (
              <button key={framework.id} type="button" className={`document-studio__framework ${frameworkId === framework.id ? "is-selected" : ""}`} onClick={() => chooseFramework(framework.id)} aria-pressed={frameworkId === framework.id} disabled={intakeState === "processing"}>
                <FileText size={17} /><span><strong>{framework.name}</strong><small>{framework.description}</small></span><ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>

        {frameworkId && (
          <section className="document-studio__section" aria-labelledby="upload-heading">
            <div className="document-studio__section-heading">
              <div><p className="document-studio__eyebrow">Step 2</p><h2 id="upload-heading">Add inbound NDA</h2></div>
              <span>15 MB max</span>
            </div>
            <input id="document-studio-file" ref={inputRef} className="sr-only" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => chooseFile(event.target.files?.[0])} />
            <div
              ref={dropRef}
              className="document-dropzone"
              data-state={intakeState}
              role={file ? undefined : "button"}
              tabIndex={file ? undefined : 0}
              aria-label={file ? undefined : "Add Word NDA"}
              aria-describedby={file ? "document-dropzone-status" : "document-dropzone-meta document-dropzone-status"}
              data-invalid={error ? "true" : "false"}
              aria-disabled={intakeState === "processing"}
              onClick={() => !file && intakeState !== "processing" && inputRef.current?.click()}
              onKeyDown={(event) => {
                if (!file && (event.key === "Enter" || event.key === " ") && intakeState !== "processing") {
                  event.preventDefault(); inputRef.current?.click();
                }
              }}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {file ? (
                <div className="document-file-row">
                  <div className="document-file-row__icon">{intakeState === "processing" ? <LoaderCircle size={22} /> : <FileCheck2 size={22} />}</div>
                  <div className="document-file-row__copy"><strong>{file.name}</strong><small>{formatBytes(file.size)} · {intakeState === "processing" ? "Inspecting document…" : intakeState === "success" ? "Inspection complete" : "Ready to inspect"}</small></div>
                  {intakeState !== "processing" && <button type="button" className="document-file-row__remove" onClick={(event) => { event.stopPropagation(); removeFile(); }} aria-label={`Remove ${file.name}`}><X size={16} /></button>}
                </div>
              ) : (
                <div className="document-dropzone__empty">
                  <span className="document-dropzone__icon"><UploadCloud size={24} /></span>
                  <strong>{intakeState === "drag-valid" ? "Release to add NDA" : intakeState === "drag-invalid" ? "Only one Word .docx file" : "Drop your NDA here"}</strong>
                  <span>or <u>choose a file</u></span>
                  <small id="document-dropzone-meta">Word .docx · maximum 15 MB</small>
                </div>
              )}
              {intakeState === "processing" && <div className="document-dropzone__progress" aria-hidden="true"><span /></div>}
            </div>
            <div id="document-dropzone-status" className="document-dropzone__status" aria-live="polite">
              {error && <span role="alert"><AlertCircle size={14} /> {error}</span>}
              {intakeState === "success" && inspection && <span><Check size={14} /> Read {inspection.paragraphCount} paragraphs and found {inspection.findings.length} items to review.</span>}
            </div>
            {file && intakeState === "ready" && (
              <button type="button" className="document-studio__primary document-studio__analyze" onClick={inspect}><FileText size={16} /> Inspect NDA</button>
            )}
            {file && intakeState === "error" && <button type="button" className="document-studio__text-button" onClick={inspect}><RotateCcw size={14} /> Try inspection again</button>}
          </section>
        )}

        {inspection && (
          <section className="document-studio__section" aria-labelledby="findings-heading">
            <div className="document-studio__section-heading">
              <div><p className="document-studio__eyebrow">Step 3</p><h2 id="findings-heading">Review grounded findings</h2></div>
              <span>{Object.keys(decisions).length} of {inspection.findings.length} decided</span>
            </div>
            {inspection.findings.length === 0 ? (
              <div className="document-studio__empty-review"><Check size={18} /><div><strong>No sample-policy matches found</strong><p>Atlas read the document successfully. A production framework will include broader clause coverage.</p></div></div>
            ) : (
              <div className="document-studio__changes">
                {inspection.findings.map((finding) => (
                  <article key={finding.id} className="document-studio__change">
                    <div><h3>{finding.clause}</h3><span>{finding.severity}</span></div>
                    <blockquote>{finding.sourceText}</blockquote>
                    <p>{finding.recommendation}</p>
                    <small>{finding.reason} · Rule {finding.frameworkRule} · Source {finding.sourceId}</small>
                    <div className="document-studio__decisions" aria-label={`Decision for ${finding.clause}`}>
                      {(["accepted", "rejected", "escalated"] as const).map((decision) => (
                        <button key={decision} type="button" className={decisions[finding.id] === decision ? "is-selected" : ""} onClick={() => setDecisions((current) => ({ ...current, [finding.id]: decision }))} aria-pressed={decisions[finding.id] === decision}>{decision === "accepted" ? "Accept" : decision === "rejected" ? "Reject" : "Escalate"}</button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="document-studio__review-note"><ShieldCheck size={17} /> Findings come from actual document text under the {selectedFramework?.name}. Native tracked-changes export remains locked until Word fidelity validation is complete.</div>
            {inspection.findings.length > 0 && <button type="button" className="document-studio__primary document-studio__generate" disabled={!reviewComplete}>{reviewComplete ? "Ready for tracked-change renderer" : `Decide ${inspection.findings.length - Object.keys(decisions).length} remaining item${inspection.findings.length - Object.keys(decisions).length === 1 ? "" : "s"}`}</button>}
          </section>
        )}
      </div>
    </main>
  );
}
