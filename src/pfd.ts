import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { StructuredRequirements } from "./types.js";

export function generatePDF(
  data: StructuredRequirements,
  projectId: string,
  version: number
): string {
  const outDir = path.resolve("out", projectId);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(outDir, `Requirements_v${version}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ✅ Load universal Unicode font (supports multilingual text)
  const fontPath = path.join(process.cwd(), "fonts", "NotoSansDevanagari-Regular.ttf");
  if (fs.existsSync(fontPath)) {
    doc.font(fontPath);
  }

  // Title
  doc.fontSize(20).text(data.title || "Requirements Document", { align: "center" });
  doc.moveDown(2);

  // Sections
  for (const section of data.sections || []) {
    doc.fontSize(16).text(section.heading, { underline: true });
    doc.moveDown(0.5);

    (section.bullets || []).forEach(b => {
      doc.fontSize(12).text("• " + b, { indent: 20 });
    });

    (section.subheadings || []).forEach(sub => {
      doc.moveDown(0.5);

      // Italic for subheading
      if (fs.existsSync(fontPath)) {
        doc.font(fontPath).fontSize(14).text(sub.title, { indent: 10 });
      } else {
        doc.font("Times-Italic").fontSize(14).text(sub.title, { indent: 10 });
      }

      (sub.bullets || []).forEach(b => {
        doc.fontSize(12).text("– " + b, { indent: 30 });
      });
    });

    doc.moveDown();
  }

  // Assumptions
  if (data.assumptions?.length) {
    doc.addPage();
    doc.fontSize(16).text("Assumptions", { underline: true });
    doc.moveDown(0.5);
    data.assumptions.forEach(a => doc.fontSize(12).text("• " + a, { indent: 20 }));
  }

  // Out of Scope
  if (data.outOfScope?.length) {
    doc.addPage();
    doc.fontSize(16).text("Out of Scope", { underline: true });
    doc.moveDown(0.5);
    data.outOfScope.forEach(o => doc.fontSize(12).text("• " + o, { indent: 20 }));
  }

  doc.end();
  return filePath;
}
