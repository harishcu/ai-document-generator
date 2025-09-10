import path from "node:path";
import { generateDocx } from "./docx.js";
import { preprocess } from "./preprocess.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { structureRequirements } from "./llm.js";
import { StructuredRequirements } from "./types.js";
import { addVersion, loadMetadata } from "./versioning.js";
import { loadTemplate } from "./rag.js";
import { generatePDF } from "./pfd.js";   

export async function runWorkflow(
  requirementsText: string,
  projectId: string,
  summary = "Initial submission",
  templateName?: string,  
  language: string = "en"
): Promise<{ filePath: string; pdfPath: string; version: number }> {
  const points = preprocess(requirementsText);

  // ✅ Add template if provided
  const template = templateName ? loadTemplate(templateName) : "";

  const userPrompt = `
  ${template ? `Follow this template:\n${template}\n\n` : ""}
  Organize these requirement points into a structured document:
  ${points.map((p, i) => `${i + 1}. ${p}`).join("\n")}
  IMPORTANT: Write the document in **${language}**.
  All section titles, bullets, assumptions, and text must be fully written in ${language}.
  Do not include English anywhere.
  `;

  const structuredData: StructuredRequirements = await structureRequirements(
    SYSTEM_PROMPT,
    userPrompt
  );

  const meta = loadMetadata(projectId);
  const nextVersion = meta.versions.length + 1;

  // ✅ Generate DOCX
  const filePath = await generateDocx(structuredData, projectId, "out", nextVersion);

  // ✅ Generate PDF
  const pdfPath = generatePDF(structuredData, projectId, nextVersion);

  // ✅ Save version metadata
  const versionInfo = addVersion(projectId, path.basename(filePath), summary);

  return { filePath, pdfPath, version: versionInfo.version };
}
