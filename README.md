# 🎯 CandidateIQ — Candidate Profile Shortlisting System

A full-stack web application for shortlisting and ranking job candidates based on skill matching, with AI-powered analysis via the OpenRouter API.

---

## 📁 Project Structure

```
candidate-shortlisting/
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── candidateController.js  # CRUD for candidates
│   │   ├── matchController.js      # Core shortlisting logic
│   │   └── aiController.js         # OpenRouter AI integration
│   ├── models/
│   │   └── Candidate.js            # Mongoose schema
│   ├── routes/
│   │   ├── candidateRoutes.js
│   │   ├── matchRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js / .css
│   │   │   ├── CandidateCard.js / .css
│   │   │   ├── JobRequirementForm.js
│   │   │   └── MatchScoreChart.js
│   │   ├── pages/
│   │   │   ├── CandidateFormPage.js / .css
│   │   │   ├── CandidateListPage.js / .css
│   │   │   ├── ShortlistPage.js
│   │   │   └── AiShortlistPage.js / .css
│   │   ├── services/
│   │   │   └── api.js              # Axios API service
│   │   ├── App.js / App.css
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json                    # Root scripts (concurrently)
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **OpenRouter API Key** — get one free at [openrouter.ai](https://openrouter.ai)

---

### 1. Clone / Unzip the Project

```bash
unzip candidate-shortlisting.zip
cd candidate-shortlisting
```

---

### 2. Configure Environment Variables

#### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/candidate-shortlisting
OPENROUTER_API_KEY=sk-or-your-key-here
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` (only needed if backend runs on a different port):

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Install Dependencies

From the root folder:

```bash
npm install          # installs concurrently
npm run install:all  # installs backend + frontend dependencies
```

Or install manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 4. Run the Application

#### Development (both servers together)

```bash
# From the root folder
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

#### Or run separately

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

---

## 🔌 API Endpoints

### Candidate APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/candidates` | Add a new candidate |
| `GET` | `/api/candidates` | Get all candidates (supports `?search=` and `?skill=`) |
| `GET` | `/api/candidates/:id` | Get candidate by ID |
| `DELETE` | `/api/candidates/:id` | Delete a candidate |

#### Example — Add Candidate

```json
POST /api/candidates
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": 2,
  "bio": "Full stack developer with 2 years experience"
}
```

---

### Matching APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/match` | Basic skill-match shortlisting |
| `POST` | `/api/ai/shortlist` | AI-powered shortlisting via OpenRouter |
| `POST` | `/api/ai/interview-questions` | Generate interview questions for a candidate |

#### Example — Basic Shortlist

```json
POST /api/match
{
  "requiredSkills": ["React", "Node.js"],
  "minExperience": 1,
  "preferredSkills": ["AWS"]
}
```

#### Example — AI Shortlist

```json
POST /api/ai/shortlist
{
  "requiredSkills": ["React", "Node.js"],
  "minExperience": 1,
  "preferredSkills": ["AWS", "TypeScript"]
}
```

---

## 🧠 Matching Logic

Candidates are scored and tiered as follows:

| Tier | Criteria |
|------|----------|
| **High** | ≥75% required skill overlap AND meets min experience |
| **Partial** | ≥40% required skill overlap OR meets experience |
| **Low** | Below both thresholds |

A preferred skill bonus (up to +20%) is added to the score.

---

## 🤖 AI Features (OpenRouter)

The AI module sends candidate profiles + job requirements to **OpenRouter** (model: `openai/gpt-4o-mini`) and returns:

- Ranked list of candidates with explanations
- Suggested interview questions per candidate
- An overall candidate pool summary
- Bonus: generate additional tailored interview questions per candidate

---

## 📊 Frontend Features

- **Candidate Form** — Add candidates with name, email, skills, experience, bio
- **Candidate List** — Search/filter all candidates
- **Shortlist** — Run basic skill match; view tiered results + bar chart
- **AI Shortlist** — AI-ranked results with recommendations and interview questions

---

## 🗄️ MongoDB Schema

```js
{
  name: String,
  email: String (unique),
  skills: [String],
  experience: Number,
  bio: String,
  createdAt: Date
}
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB connection error` | Ensure MongoDB is running: `mongod` or check your Atlas URI |
| `OPENROUTER_API_KEY not configured` | Add the key to `backend/.env` |
| Frontend can't reach backend | Check `REACT_APP_API_BASE_URL` in `frontend/.env` |
| Port conflict | Change `PORT` in `backend/.env`; update proxy in `frontend/package.json` |
