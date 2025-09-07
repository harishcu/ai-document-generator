import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  TableOfContents
} from "docx";
import { StructuredRequirements } from "./types.js";

export async function generateDocx(
  data: StructuredRequirements,
  outDir = "out"
): Promise<string> {
  fs.mkdirSync(outDir, { recursive: true });

  // Build the paragraphs (children) first
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: data.title || "AI Chatbot Requirement Document",
      heading: HeadingLevel.TITLE
    })
  );

  // Spacer + TOC header
  children.push(new Paragraph({ text: "" }));
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Table of Contents", bold: true })]
    })
  );

  // Table of contents must be wrapped inside a Paragraph's children
  children.push(
    new Paragraph({
      children: [
        new TableOfContents("TOC", {
          hyperlink: true,
          headingStyleRange: "1-5"
        })
      ]
    })
  );

  children.push(new Paragraph({ text: "" }));

  // Table of Figures (optional)
  if (data.figures && data.figures.length > 0) {
    children.push(
      new Paragraph({
        text: "Table of Figures",
        heading: HeadingLevel.HEADING_1
      })
    );
    data.figures.forEach((f, i) => {
      children.push(new Paragraph(`${i + 1}. ${f.caption}`));
    });
    children.push(new Paragraph({ text: "" }));
  }

  // Sections
  for (const section of data.sections || []) {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_1
      })
    );

    (section.bullets || []).forEach((b) =>
      children.push(new Paragraph({ text: b, bullet: { level: 0 } }))
    );

    (section.subheadings || []).forEach((sub) => {
      children.push(
        new Paragraph({
          text: sub.title,
          heading: HeadingLevel.HEADING_2
        })
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

  // Create the Document with sections containing the children
  const doc = new Document({
    sections: [
      {
        children
      }
    ],
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { bold: true, size: 32 },
          paragraph: { spacing: { after: 240 } }
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { bold: true, size: 26 },
          paragraph: { spacing: { before: 240, after: 120 } }
        }
      ]
    }
  });

  // Save file
  const fileName = `Requirements_${Date.now()}.docx`;
  const filePath = path.join(outDir, fileName);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}
