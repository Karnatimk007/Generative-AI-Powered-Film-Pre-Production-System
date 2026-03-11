# 🎬 Scriptoria

### AI-Powered Film Pre-Production Assistant

**Team Name:** ThinkwithUs

Scriptoria is an AI-powered film pre-production platform that transforms a simple story idea into a **complete production-ready filmmaking package within minutes**.

Instead of spending **weeks planning scripts, characters, sound design, and shot lists**, Scriptoria automates the entire workflow using **multi-model AI orchestration**.

---

# 🚀 Overview

Scriptoria helps **independent filmmakers, students, and creators** generate the core documents required before filming begins.

From a **single story prompt**, Scriptoria generates:

🎥 Formatted Screenplay  
👤 Character Profiles  
🎵 Sound Design Plan  
📋 Scene-by-Scene Script Breakdown  
🎬 Professional Shot List  
🖼 AI-Generated Shot Visualizations

The system combines **LLMs + diffusion image generation** to simulate a real pre-production workflow used in professional film studios.

---

# 🎯 Problem Statement

Independent filmmakers often skip structured pre-production due to:

- High outsourcing costs (**₹50,000 – ₹2,00,000**)
- Lack of access to professional writers
- Limited planning tools
- Time constraints

Skipping pre-production leads to:

❌ Poorly planned shoots  
❌ Budget overruns  
❌ Production delays

---

# 💡 Our Solution

Scriptoria automates **five interconnected filmmaking deliverables** using AI models.

### User Workflow

User enters story idea  
↓  
Flask Backend API  
↓  
AI Model Orchestration (Groq / Gemini / Granite / Diffusers)  
↓  
Generate 5 Pre-Production Documents  
↓  
Display in Web Studio  
↓  
Export as TXT / PDF / DOCX

This turns **weeks of planning into minutes.**

---

# ✨ Core Features

## 🎬 1. Screenplay Generator

Automatically generates a **professionally formatted screenplay**.

Features:

- Industry standard screenplay formatting
- INT. / EXT. scene headings
- Dialogue formatting
- Scene descriptions
- Cinematic pacing

---

## 👥 2. Character Profiles

Generates detailed character sheets including:

- Name
- Age
- Personality traits
- Motivations
- Character arc
- Costume ideas
- Relationships

Useful for **casting and costume design.**

---

## 🎵 3. Sound Design Plan

Automatically plans the **audio storytelling layer**.

Includes:

- Background score suggestions
- Ambient sound design
- Emotional beats
- Silence usage
- Scene transitions

---

## 📋 4. Script Breakdown

Essential for **production planning**.

Per-scene breakdown includes:

- Location
- Day / Night classification
- Characters present
- Props required
- Costume notes
- Production requirements

---

## 🎥 5. Professional Shot List

Creates a cinematography plan including:

- Shot number
- Shot type (CU, MS, WS)
- Camera angle
- Lens suggestion
- Lighting mood
- Camera movement

---

## 🖼 AI Shot Visualization

Shot descriptions can be converted into **visual reference frames** using diffusion models.

These images help directors and cinematographers **visualize scenes before filming.**

---

# 🔐 Authentication System

Scriptoria includes **secure user authentication backed by MongoDB.**

### Features

✔ Register / Login system  
✔ Password hashing with bcrypt  
✔ Session management using Flask-Login  
✔ Protected studio routes  
✔ Logout functionality

### Database

MongoDB

```
mongodb://localhost:27017
```

Database

```
scriptoria_db
```

Collection

```
users
```

Example user document

```json
{
  "name": "User Name",
  "email": "user@email.com",
  "password_hash": "bcrypt_hash",
  "created_at": "timestamp"
}
```

---

# 🖼 Image Generation

Scriptoria uses the **Hugging Face InferenceClient API** for blazing fast AI shot visualization. We currently use `nscale` as the cloud provider and `stabilityai/stable-diffusion-xl-base-1.0` as the model.

Example:

```python
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="nscale",
    api_key=os.environ["HF_API_KEY"],
)

image = client.text_to_image(
    prompt="Cinematic shot of...",
    model="stabilityai/stable-diffusion-xl-base-1.0",
)
```

Features:
✔ Extremely fast API generation  
✔ No local heavy GPUs required  
✔ High quality diffusion models  
✔ Concurrent 'Generate All' support

---

# 🏗 Technical Architecture

## Backend

- Python
- Flask
- REST API architecture
- MongoDB database
- Session management

---

## AI Models Used

| Task                    | Model                      |
| ----------------------- | -------------------------- |
| Screenplay              | Groq (openai/gpt-oss-120b) |
| Characters              | Groq                       |
| Sound Design            | Groq                       |
| Script Breakdown        | Groq                       |
| Shot List               | Groq                       |
| Optional Local LLM      | IBM Granite (Ollama)       |
| Image Generation        | Diffusers                  |
| Analytical Enhancements | Google Gemini              |

---

## Frontend

- HTML5
- CSS3
- JavaScript SPA
- Cinematic dark theme
- Progressive sidebar navigation
- Loading indicators
- Session persistence

---

# 📄 Document Export

Generated content can be exported as:

| Format | Library     |
| ------ | ----------- |
| PDF    | ReportLab   |
| DOCX   | python-docx |
| TXT    | Raw text    |

Formatting includes:

- Times Roman / Cambria
- 11pt text
- Structured headings
- Clean screenplay style formatting

---

# 📁 Project Structure

```
GEN/

├── app.py
├── db.py
├── requirements.txt
├── .env

├── static
│   ├── css
│   │   ├── style.css
│   │   └── auth-pages.css
│   └── js
│       └── main.js
│
└── templates
    ├── index.html
    ├── login.html
    └── register.html
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_REPO/scriptoria.git
cd scriptoria
```

---

## 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Install MongoDB

Download MongoDB

https://www.mongodb.com/try/download/community

Start MongoDB

```bash
mongod
```

MongoDB will run on

```
mongodb://localhost:27017
```

---

## 4️⃣ Install Ollama (Optional Local LLM)

Download

https://ollama.com

Check version

```bash
ollama --version
```

Pull Granite model

```bash
ollama pull granite3.2:2b
```

Start server

```bash
ollama serve
```

---

## 5️⃣ Configure Environment Variables

Create `.env`

```
SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_key
HF_API_KEY=your_hf_key
```

⚠️ Never commit `.env` to GitHub.

---

## 6️⃣ Run Application

```bash
python app.py
```

Open browser

```
http://localhost:5000
```

---

# 🔒 Security

Scriptoria includes:

- Environment variable API keys
- Password hashing
- Session authentication
- Protected API routes
- Input validation
- AI request error handling

---

# 📊 Business Impact

Scriptoria automates services that normally cost:

**₹50,000 – ₹2,00,000 per project**

Benefits:

✔ Empowers independent filmmakers  
✔ Helps student creators  
✔ Reduces production planning cost  
✔ Democratizes filmmaking

---

# 💰 Potential Monetization

- Freemium export limits
- Subscription model
- Film school licensing
- Studio integration API

---

# 🏆 Innovation

Most AI tools generate **only scripts**.

Scriptoria uniquely:

✔ Maintains **interdependency across documents**  
✔ Combines **creative writing + production planning**  
✔ Generates **cinematography shot lists**  
✔ Produces **visual shot references**

It bridges storytelling and filmmaking logistics.

---

# 🚀 Future Scope

- Budget Estimator
- Production Timeline Generator
- Multi-user collaboration
- Cloud deployment
- Multi-language screenplay generation
- Casting suggestions
- AI location scouting

---

# 👥 Team

**Team Name:** ThinkwithUs

Hackathon Submission Project

---

# 🎤 Pitch

Scriptoria transforms a simple story idea into a **complete film pre-production package in minutes using AI.**

By combining **LLMs, diffusion models, and filmmaking workflows**, Scriptoria helps creators focus on storytelling while AI handles the planning.
