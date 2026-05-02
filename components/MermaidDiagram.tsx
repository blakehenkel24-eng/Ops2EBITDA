"use client";

import { useEffect, useId, useState } from "react";
import type mermaid from "mermaid";

let mermaidPromise: Promise<typeof mermaid> | null = null;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((module) => {
    module.default.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "transparent",
        primaryColor: "#f0ece3",
        primaryTextColor: "#22201c",
        primaryBorderColor: "#ded8cd",
        lineColor: "#9a9287",
        secondaryColor: "#f1e4dc",
        tertiaryColor: "#f8f6f1",
        fontFamily: "Aptos, Avenir Next, Segoe UI, sans-serif",
        fontSize: "13px",
        clusterBkg: "transparent",
        clusterBorder: "#ded8cd",
        edgeLabelBackground: "#fffdf8",
        nodeTextColor: "#22201c",
      },
    });

    return module.default;
  });

  return mermaidPromise;
}

export function MermaidDiagram({
  chart,
  title,
  description,
}: {
  chart: string;
  title: string;
  description: string;
}) {
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    loadMermaid()
      .then((renderer) => renderer.render(id, chart))
      .then((result) => {
        if (active) {
          setSvg(result.svg);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to render diagram.");
        }
      });

    return () => {
      active = false;
    };
  }, [chart, id]);

  return (
    <figure
      className="my-12"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <figcaption className="mb-6">
        <h3 id={`${id}-title`} className="text-2xl font-semibold tracking-[-0.01em]">
          {title}
        </h3>
        <p
          id={`${id}-description`}
          className="mt-2 text-base leading-6 text-[var(--muted)]"
        >
          {description}
        </p>
      </figcaption>
      <div className="min-h-48 p-6 md:p-8">
        {svg ? (
          <div
            className="mermaid-output"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : error ? (
          <pre
            role="alert"
            className="overflow-x-auto rounded-lg bg-[var(--accent-soft)] p-4 text-xs text-[var(--ink)]"
          >
            {error}
          </pre>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="flex h-72 items-center justify-center text-sm font-bold text-[var(--muted)]"
          >
            Rendering diagram...
          </div>
        )}
      </div>
    </figure>
  );
}
