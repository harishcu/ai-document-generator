import OpenAI from "openai";
import { StructuredRequirements } from "./types.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function structureRequirements(
  systemPrompt: string,
  userPrompt: string
): Promise<StructuredRequirements> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",         // pick a model you have access to
    temperature: 0.2,
    response_format: { type: "json_object" }, // ensures JSON
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const json = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(json) as StructuredRequirements;
}
