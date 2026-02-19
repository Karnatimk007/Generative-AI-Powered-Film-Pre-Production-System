# 🎬 Scriptoria  
### AI-Powered Film Pre-Production Assistant  
**Team Name:** ThinkwithUs  

---

## 🚀 Overview

Scriptoria is an AI-powered film pre-production web application that transforms a simple story idea into a complete, production-ready pre-production package within minutes.

Using IBM Granite (via Ollama), Groq LLM APIs, Google Gemini, and Hugging Face image generation, Scriptoria automates five major filmmaking deliverables:

- 🎥 Formatted Screenplay  
- 👤 Character Profiles  
- 🎵 Sound Design Plan  
- 📋 Scene-by-Scene Script Breakdown  
- 🎬 Professional Shot List  
- 🖼 AI-Generated Shot Visuals (via Hugging Face)

Scriptoria reduces weeks of manual pre-production planning into an instant AI-driven workflow.

---

## 🎯 Problem Statement

Independent filmmakers, student creators, and YouTube series developers often skip structured pre-production due to:

- High outsourcing costs (₹50,000 – ₹2,00,000)
- Limited access to professional screenwriters and cinematographers
- Time constraints
- Lack of production planning tools

Skipping pre-production leads to poorly planned shoots, budget overruns, and production delays.

---

## 💡 Our Solution

Scriptoria automates five interconnected pre-production deliverables from a single story input using specialized AI prompts and multi-model orchestration.

### User Flow

User enters story →  
Flask Backend →  
AI Models (Granite / Groq / Gemini / HuggingFace) →  
Generate 5 Documents →  
Display in SPA →  
Export (TXT / PDF / DOCX)

---

## ✨ Key Features

### 🎬 1. Screenplay Generator
- Industry-standard formatting
- ALL CAPS scene headings
- INT./EXT. structure
- Proper dialogue formatting

### 👥 2. Character Profiles
- Name, Age
- Personality traits
- Motivation
- Character arc
- Costume design
- Relationships

### 🎵 3. Sound Design Plan
- Background score suggestions
- Ambient sound planning
- Emotional beats
- Silence usage
- Scene transitions

### 📋 4. Script Breakdown
- Location per scene
- Day/Night classification
- Characters present
- Props required
- Costume notes
- Production requirements

### 🎥 5. Professional Shot List
- Shot number
- Shot type (CU, MS, WS, etc.)
- Camera angle
- Lens suggestion
- Lighting mood
- Camera movement

### 🖼 AI Shot Visualization
Shot descriptions can be converted into visual reference frames using Hugging Face image generation APIs.

---

## 🏗 Technical Architecture

### Backend
- Python
- Flask
- REST API routes
- Session management
- Modular AI service structure

### AI Models Used

| Task | Model |
|------|-------|
| Screenplay | Groq (openai/gpt-oss-120b) |
| Characters | Groq |
| Sound Design | Groq |
| Script Breakdown | Groq |
| Shot List | Groq |
| Optional Local LLM | IBM Granite (Ollama) |
| Image Generation | Hugging Face API |
| Analytical Enhancements | Google Gemini |

---

## 🎨 Frontend

- HTML5
- CSS3 (Cinema Dark Theme with Gold Accents)
- JavaScript SPA
- Progressive Sidebar Navigation
- Loading Indicators
- Session Persistence
- "New Story" Reset Feature

---

## 📄 Document Export

- PDF → ReportLab (Times-Roman 11pt, 1.5 line spacing)
- DOCX → python-docx (Cambria 11pt, structured headings)
- TXT → Clean raw text format

---

## 📁 Project Structure

GEN/
├── app.py  
├── requirements.txt  
├── static/  
│   ├── css/style.css  
│   └── js/main.js  
└── templates/  
    └── index.html  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-link>
cd GEN
2️⃣ Install Dependencies
pip install -r requirements.txt

3️⃣ Install Ollama (If Using Local Granite)

Download from:
https://ollama.com

Check version:

ollama --version


Pull model:

ollama pull granite3.2:2b


Start server:

ollama serve

4️⃣ Configure Environment Variables

Create a .env file:

GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
HUGGINGFACE_API_KEY=your_hf_key


Never hardcode API keys.

5️⃣ Run Application
python app.py


Open browser:

http://localhost:5000

🔐 Security & Optimization

Environment variable API keys

Session-based document storage

Input validation

AI timeout handling

Error handling for API failures

Frontend request locking during generation

📊 Business Impact

Scriptoria automates five professional services that typically cost:

₹50,000 – ₹2,00,000 per project

Impact:

Empowers independent filmmakers

Enables student creators

Reduces production planning cost

Democratizes filmmaking in emerging markets

Potential Monetization

Freemium export limits

Subscription model

Film school licensing

Studio integration API

🏆 Innovation & Uniqueness

No existing AI tool generates a complete interconnected pre-production package in a single system.

Scriptoria uniquely:

Maintains interdependency across documents

Follows real film industry conventions

Combines creative writing and production logistics

Bridges storytelling and cinematography planning

🚀 Future Scope

Budget Estimator Module

Production Timeline Generator

Team Collaboration System

Cloud Deployment

Multi-language Screenplay Support

Casting & Location AI Suggestions

👥 Team

Team Name: ThinkwithUs

Hackathon Submission Project

🎤 Pitch Summary

Scriptoria reduces weeks of pre-production work into minutes using AI.

We automate screenplay writing, character development, sound planning, script breakdown, and cinematography shot lists — tasks that typically cost up to ₹2 lakhs — making professional filmmaking accessible to everyone.