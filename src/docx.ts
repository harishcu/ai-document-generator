import fs from "node:fs";
import path from "node:path";
import { StructuredRequirements } from "./types.js";

export async function generateDocx(
  data: StructuredRequirements,
  projectId: string,
  outDir = "out",
  version?: number
): Promise<string> {
  // ✅ Dynamically import 'docx' correctly
  const docxModule = await import("docx");
  const { Document, Packer, Paragraph, HeadingLevel, TextRun, TableOfContents } = docxModule;

  const projectDir = path.join(outDir, projectId);
  fs.mkdirSync(projectDir, { recursive: true });

  const fileName = `Requirements_v${version}.docx`;

  const filePath = path.join(projectDir, fileName);

  const children: any[] = []; // Temporarily relax type checking

  // Title
  children.push(
    new Paragraph({
      text: data.title || "AI Chatbot Requirement Document",
      heading: HeadingLevel.HEADING_1,
    })
  );

  children.push(new Paragraph({ text: "" }));

  // Table of Contents
  children.push(
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-5",
    })
  );

  children.push(new Paragraph({ text: "" }));

  // Figures
  if (data.figures && data.figures.length > 0) {
    children.push(
      new Paragraph({
        text: "Table of Figures",
        heading: HeadingLevel.HEADING_1,
      })
    );
    data.figures.forEach((f, i) => {
      children.push(new Paragraph(`${i + 1}. ${f.caption}`));
    });
    children.push(new Paragraph({ text: "" }));
  }

  // Sections + subheadings
  for (const section of data.sections || []) {
    children.push(
      new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_1 })
    );

    (section.bullets || []).forEach((b) =>
      children.push(new Paragraph({ text: b, bullet: { level: 0 } }))
    );

    (section.subheadings || []).forEach((sub) => {
      children.push(
        new Paragraph({ text: sub.title, heading: HeadingLevel.HEADING_2 })
      );
      (sub.bullets || []).forEach((b) =>
        children.push(new Paragraph({ text: b, bullet: { level: 1 } }))
      );
    });
  }

  // Assumptions
  children.push(
    new Paragraph({ text: "Assumptions", heading: HeadingLevel.HEADING_1 })
  );
  (data.assumptions || []).forEach((a) =>
    children.push(new Paragraph({ text: a, bullet: { level: 0 } }))
  );

  // Out of Scope
  children.push(
    new Paragraph({ text: "Out of Scope", heading: HeadingLevel.HEADING_1 })
  );
  (data.outOfScope || []).forEach((o) =>
    children.push(new Paragraph({ text: o, bullet: { level: 0 } }))
  );

  // Build document
  const doc = new Document({
    sections: [{ children }],
  });

  // Save
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
