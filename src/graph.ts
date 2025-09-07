import { generateDocx } from "./docx.js";
import { preprocess } from "./preprocess.js";
import { SYSTEM_PROMPT, userPromptFor } from "./prompt.js";
import { structureRequirements } from "./llm.js";
import { StructuredRequirements } from "./types.js";

/**
 * This function runs your real LangGraph-style workflow:
 * 1. Preprocess raw requirements text
 * 2. Build user prompt with preprocessed points
 * 3. Call the LLM to structure the requirements
 * 4. Generate DOCX and return the file path
 */
export async function runWorkflow(requirementsText: string): Promise<string> {
  // 1. Preprocess raw input into clean bullet points
  const points = preprocess(requirementsText);

  // 2. Build user prompt
  const userPrompt = userPromptFor(points);

  // 3. Call LLM to get structured JSON
  const structuredData: StructuredRequirements = await structureRequirements(
    SYSTEM_PROMPT,
    userPrompt
  );

  // 4. Generate DOCX
  const filePath = await generateDocx(structuredData);
  return filePath;
}
