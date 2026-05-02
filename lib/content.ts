import fs from "node:fs";
import path from "node:path";
import type { AnyContent, Fundamental, Industry, Kpi, Playbook, SourceRef } from "./types";

const contentRoot = path.join(process.cwd(), "content");

const directories = {
  fundamentals: "fundamentals",
  playbooks: "playbooks",
  industries: "industries",
  kpis: "kpis",
} as const;

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readCollection<T extends AnyContent>(directory: string): T[] {
  const fullPath = path.join(contentRoot, directory);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<T>(path.join(fullPath, file)))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function readSourceCollection(directory: string): SourceRef[] {
  const fullPath = path.join(contentRoot, directory);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<SourceRef>(path.join(fullPath, file)))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getFundamentals() {
  return readCollection<Fundamental>(directories.fundamentals);
}

export function getPlaybooks() {
  return readCollection<Playbook>(directories.playbooks);
}

export function getIndustries() {
  return readCollection<Industry>(directories.industries);
}

export function getKpis() {
  return readCollection<Kpi>(directories.kpis);
}

export function getSources() {
  return readSourceCollection("sources");
}

export function getAllContent(): AnyContent[] {
  return [
    ...getFundamentals(),
    ...getPlaybooks(),
    ...getIndustries(),
    ...getKpis(),
  ];
}

export function getBySlug<T extends AnyContent>(
  collection: T[],
  slug: string,
) {
  return collection.find((item) => item.slug === slug);
}

export function getContentStats() {
  return {
    fundamentals: getFundamentals().length,
    playbooks: getPlaybooks().length,
    industries: getIndustries().length,
    kpis: getKpis().length,
  };
}
