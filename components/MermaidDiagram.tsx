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
        primaryColor: "#FBF8F2", // Paper
        primaryTextColor: "#161413", // Ink
        primaryBorderColor: "#928B7E", // Stone
        lineColor: "#928B7E", // Stone
        secondaryColor: "#F4EFE6", // Bone
        tertiaryColor: "#FBF8F2", // Paper
        fontFamily: "var(--font-geist), sans-serif",
        fontSize: "13px",
        clusterBkg: "transparent",
        clusterBorder: "#928B7E",
        edgeLabelBackground: "#FBF8F2",
        nodeTextColor: "#161413",
        mainBkg: "#FBF8F2",
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
        <h3 id={`${id}-title`} className="font-newsreader text-2xl text-ink">
          {title}
        </h3>
        <p
          id={`${id}-description`}
          className="mt-2 text-base leading-6 text-stone font-geist"
        >
          {description}
        </p>
      </figcaption>
      <div className="min-h-48 p-6 md:p-8 border border-stone/30 bg-paper">
        {svg ? (
          <div
            className="mermaid-output"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : error ? (
          <pre
            role="alert"
            className="overflow-x-auto border border-sienna bg-bone p-4 text-xs text-sienna font-mono"
          >
            {error}
          </pre>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className="flex h-72 items-center justify-center font-mono-label text-stone"
          >
            Rendering diagram...
          </div>
        )}
      </div>
    </figure>
  );
}
