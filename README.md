# 📄 AI Requirements Document Generator

## 📌 Project Overview
This project converts **messy requirement text** into a structured **Word document (.docx)** using **OpenAI GPT models**.  
It helps quickly create clear requirement specifications for software projects.

---

## 🚀 Features
- Accepts unstructured requirement text as input.
- Cleans and organizes requirements into:
  - Title
  - Sections and Subsections
  - Assumptions
  - Out of Scope
  - (Optional) Figures list
- Generates a **downloadable Word (.docx)** document with:
  - Auto-generated Table of Contents
  - Structured sections with bullets
- REST API endpoint for generating documents dynamically.

---

## 🛠️ Technologies Used
- **Node.js** + **TypeScript**
- **Express.js** (API server)
- **Zod** (input validation)
- **OpenAI API** (LLM for structuring requirements)
- **docx** (Word file generation)
- **dotenv** (environment configuration)

---

## ⚙️ Setup Instructions

1. **Clone the project**
   ```bash
   git clone <your-repo-link>
   cd ai-reqdoc-bot
   npm install
Create .env file

env
Copy code
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
BASE_URL=http://localhost:3000
Run in development

bash
Copy code
npm run dev
Build & run in production

bash
Copy code
npm run build
npm start
📡 API Usage
Endpoint
bash
Copy code
POST /generate-doc
Example Request
json
Copy code
{
  "requirementsText": "The system should allow user login, an admin dashboard, and chatbot integration"
}
Example Response
json
Copy code
{
  "ok": true,
  "message": "Requirement document generated successfully.",
  "downloadUrl": "http://localhost:3000/downloads/Requirements_1694100000000.docx"
}
✅ Output Example
Generated Word document includes:

Title: AI Chatbot Requirement Document

Sections: Overview, Assumptions, Out of Scope

Table of Contents and bullets

File is downloadable via the provided downloadUrl.

🔮 Future Improvements
Add multi-language support.

Add API authentication.

Deploy to cloud (Vercel, Render, AWS, etc.).

Add a frontend UI for easier interaction.

🗂️ Project Structure
pgsql
Copy code
ai-reqdoc-bot/
│── src/
│   ├── server.ts
│   ├── graph.ts
│   ├── docx.ts
│   ├── llm.ts
│   ├── prompt.ts
│   ├── preprocess.ts
│   └── types.ts
│── .env.example
│── package.json
│── tsconfig.json
│── README.md
