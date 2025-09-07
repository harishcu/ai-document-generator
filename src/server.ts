import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import express from "express";
import { GenerateDocSchema } from "./types.js";
import { runWorkflow } from "./graph.js";

const app = express();
app.use(express.json());

// Serve generated files
const outDir = path.resolve("out");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
app.use("/downloads", express.static(outDir));

app.post("/generate-doc", async (req, res) => {
  try {
    const parsed = GenerateDocSchema.parse(req.body);

    const filePath = await runWorkflow(parsed.requirementsText);
    const fileName = path.basename(filePath);
    const base = process.env.BASE_URL ?? `http://localhost:${process.env.PORT || 3000}`;
    const downloadUrl = `${base}/downloads/${fileName}`;

    return res.json({
      ok: true,
      message: "Requirement document generated successfully.",
      downloadUrl
    });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({
      ok: false,
      error: err?.message || "Failed to generate document"
    });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Downloads served from /downloads`);
});
