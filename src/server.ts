import "dotenv/config";
import express from "express";
import path from "node:path";
import { GenerateDocSchema } from "./types.js";
import { runWorkflow } from "./graph.js";
import { loadMetadata } from "./versioning.js";

const app = express();
app.use(express.json());

// ✅ Serve generated files under /downloads
app.use("/downloads", express.static(path.join(process.cwd(), "out")));

// ✅ POST /generate (Initial submission → v1)
app.post("/generate", async (req, res) => {
  try {
    const parsed = GenerateDocSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.errors.map(e => e.message).join(", "),
      });
    }

    const { requirementsText, summary, templateName, language } = parsed.data;
    const projectId = req.body.projectId || "demo_project";

    // ✅ runWorkflow now gives us both DOCX + PDF
    const { filePath, pdfPath, version } = await runWorkflow(
      requirementsText,
      projectId,
      summary || "Initial submission",
      templateName,
      language || "en"
    );

    res.json({
      success: true,
      filePath,
      pdfPath,
      version,
      downloadUrl: `/downloads/${projectId}/${path.basename(filePath)}`,
      pdfDownloadUrl: `/downloads/${projectId}/${path.basename(pdfPath)}`
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// ✅ POST /update (Revisions → v2, v3, …)
app.post("/update", async (req, res) => {
  try {
    const parsed = GenerateDocSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.errors.map(e => e.message).join(", "),
      });
    }

    const { requirementsText, summary, templateName, language } = parsed.data;
    const projectId = req.body.projectId || "demo_project";

    const { filePath, pdfPath, version } = await runWorkflow(
      requirementsText,
      projectId,
      summary || `Update v${Date.now()}`,
      templateName,
      language || "en"
    );

    res.json({
      success: true,
      filePath,
      pdfPath,
      version,
      downloadUrl: `/downloads/${projectId}/${path.basename(filePath)}`,
      pdfDownloadUrl: `/downloads/${projectId}/${path.basename(pdfPath)}`
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// ✅ GET /versions (list metadata)
app.get("/versions/:projectId", (req, res) => {
  try {
    const projectId = req.params.projectId;
    const meta = loadMetadata(projectId);
    res.json({ success: true, projectId, versions: meta.versions });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log(`📂 Downloads available at /downloads`);
});
