import fs from "fs";
import path from "path";

export function loadTemplate(templateName: string): string {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.txt`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template ${templateName} not found`);
  }
  return fs.readFileSync(filePath, "utf-8");
}
