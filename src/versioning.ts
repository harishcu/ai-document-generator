import fs from "node:fs";
import path from "node:path";

export interface VersionInfo {
  version: number;
  fileName: string;
  timestamp: string;
  summary: string;
}

export interface ProjectMetadata {
  versions: VersionInfo[];
}

export function getProjectDir(projectId: string, base = "out"): string {
  const dir = path.join(base, projectId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getMetadataPath(projectId: string, base = "out"): string {
  return path.join(getProjectDir(projectId, base), "metadata.json");
}

export function loadMetadata(projectId: string): ProjectMetadata {
  const file = getMetadataPath(projectId);
  if (!fs.existsSync(file)) return { versions: [] };
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ProjectMetadata;
}

export function saveMetadata(projectId: string, meta: ProjectMetadata) {
  const file = getMetadataPath(projectId);
  fs.writeFileSync(file, JSON.stringify(meta, null, 2));
}

export function addVersion(
  projectId: string,
  fileName: string,
  summary: string
): VersionInfo {
  const meta = loadMetadata(projectId);
  const version = meta.versions.length + 1;
  const versionInfo: VersionInfo = {
    version,
    fileName,
    timestamp: new Date().toISOString(),
    summary
  };
  meta.versions.push(versionInfo);
  saveMetadata(projectId, meta);
  return versionInfo;
}
