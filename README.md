AI Requirement Document Generator

This project generates structured Requirement Documents (DOCX + PDF) from raw user requirement text using OpenAI LLM.
It also supports versioning (v1, v2, v3...), RAG templates for consistent structure, and multilingual export (e.g., English, Hindi, Chinese).

Features

Generate .docx requirement documents with automatic structure

Export to PDF (well-formatted, readable)

Version control (v1, v2, v3...) for each project

RAG templates for consistent document structure

Multilingual support (output in Hindi, English, Chinese, Arabic, etc.)

REST API endpoints for generate, update, and list versions

Project Structure
ai-reqdoc-bot/
│── src/
│   ├── server.ts         # Express server (API endpoints)
│   ├── graph.ts          # Workflow orchestrator
│   ├── docx.ts           # DOCX document generator
│   ├── pdf.ts            # PDF document generator
│   ├── llm.ts            # LLM (OpenAI) integration
│   ├── preprocess.ts     # Preprocessing input requirements
│   ├── prompt.ts         # Prompt templates
│   ├── rag.ts            # RAG template loader
│   ├── versioning.ts     # Version metadata handling
│   ├── types.ts          # Types & schema validation
│── templates/            # Folder with reusable templates (*.txt)
│── out/                  # Generated documents (DOCX + PDF)
│── package.json
│── tsconfig.json
│── .env                  # Your OpenAI API Key

Setup

Clone the repo

git clone https://github.com/harishcu/ai-document-generator.git



Install dependencies

npm install


Set up environment variables
Create a .env file:

OPENAI_API_KEY=your_openai_api_key_here


Run the server

npm run dev


You should see:

Server listening on http://localhost:3000
Downloads available at /downloads

API Usage (via Postman / cURL)
Generate First Document (v1)

1.POST http://localhost:3000/generate

{
  "projectId": "chatbot_mvp",
  "requirementsText": "The chatbot must support login, FAQs, and escalation to a human agent.",
  "summary": "Draft v1",
  "templateName": "src_template",
  "language": "en"
}

2.Update Project (v2)

POST http://localhost:3000/update

{
  "projectId": "chatbot_mvp",
  "requirementsText": "The chatbot must support login, FAQs, escalation to human agent, and multi-language support.",
  "summary": "Added multi-language support",
  "templateName": "src_template",
  "language": "hi"
}

3️.Add Another Update (v3)

POST http://localhost:3000/update

{
  "projectId": "chatbot_mvp",
  "requirementsText": "The chatbot must support login, FAQs, escalation to human agent, multi-language support, and integration with payment gateway.",
  "summary": "Added payment gateway integration",
  "templateName": "src_template",
  "language": "en"
}

4️.List All Versions

GET http://localhost:3000/versions/chatbot_mvp

Response:

{
  "success": true,
  "projectId": "chatbot_mvp",
  "versions": [
    { "version": 1, "fileName": "Requirements_v1.docx", "summary": "Draft v1" },
    { "version": 2, "fileName": "Requirements_v2.docx", "summary": "Added multi-language support" },
    { "version": 3, "fileName": "Requirements_v3.docx", "summary": "Added payment gateway integration" }
  ]
}

Output Files

After running, check the out/ folder:

out/
 └── chatbot_mvp/
      ├── Requirements_v1.docx
      ├── Requirements_v1.pdf
      ├── Requirements_v2.docx
      ├── Requirements_v2.pdf
      ├── Requirements_v3.docx
      ├── Requirements_v3.pdf
      └── metadata.json


You can download any file directly from your browser at:

http://localhost:3000/downloads/chatbot_mvp/Requirements_v1.docx
http://localhost:3000/downloads/chatbot_mvp/Requirements_v1.pdf

Multilingual Support

Pass language in request body:

"en" → English

"hi" → Hindi

"zh" → Chinese

"ar" → Arabic

Example:

{
  "projectId": "chatbot_mvp",
  "requirementsText": "The chatbot must support secure payments.",
  "summary": "Testing Hindi output",
  "templateName": "src_template",
  "language": "hi"
}

Done

You now have a document generation system with:

DOCX + PDF export

Version history

RAG templates

Multilingual output
