/** Normalize and split multi-line text into clean bullet points */
export function preprocess(raw: string): string[] {
  // Split by newlines, numbers ("1) ..."), or bullets ("- ", "* ")
  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // Also split inline numbered lists like "1. a; 2. b"
  const exploded = lines.flatMap(l =>
    l.split(/\s*(?:\d+\)|\d+\.|-|\*)\s+/).map(s => s.trim()).filter(Boolean)
  );

  // De-duplicate and keep non-empty
  const unique = Array.from(new Set(exploded)).filter(Boolean);

  return unique;
}
