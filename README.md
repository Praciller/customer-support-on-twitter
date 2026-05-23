# Customer Support AI System

Multimodal customer-support assistant that analyzes support tickets from text and optional images, classifies the issue, detects sentiment, estimates priority, and drafts a contextual response with Gemini.

Live demo: https://praciller.github.io/customer-support-on-twitter

## Role Fit

| Target role | Evidence shown in this repo |
| --- | --- |
| AI Engineer | Ticket classification, sentiment/priority extraction, response generation |
| GenAI Engineer | Gemini prompt design, multimodal input handling, structured AI output |
| Data Analyst | Category, sentiment, priority, and support-triage signals |
| Full-Stack / Frontend | React UI, FastAPI backend, GitHub Pages deployment, API integration |

## AI Problem Solved

Support teams need to triage incoming tickets quickly. This app turns raw ticket text and optional screenshots into structured operational signals: category, sentiment, priority, and a draft response.

## Architecture

```text
Ticket text + optional image
  -> React support UI
  -> FastAPI /analyze-ticket endpoint
  -> Gemini multimodal analysis
  -> Structured category/sentiment/priority/reply
  -> UI result cards and demo mode
```

## AI and Data Flow

- Accepts support-ticket text and optional image attachment.
- Sends the ticket payload to the backend API.
- Uses Gemini to classify category, sentiment, urgency, and likely response.
- Returns structured output for UI rendering.
- Provides a frontend demo mode for GitHub Pages while keeping the backend integration path clear.

## Key Engineering Highlights

- Multimodal ticket analysis with text and image support.
- Structured output useful for dashboards or routing rules.
- FastAPI backend with health endpoint and configurable origins.
- React frontend with responsive UI and clear loading/error states.
- GitHub Pages demo deployment.
- Frontend and backend testing setup.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Tailwind CSS, shadcn/ui-style components, Axios |
| Backend | Python, FastAPI |
| AI | Google Gemini AI |
| Deployment | GitHub Pages, GitHub Actions |
| Testing | Jest, React Testing Library, Playwright, pytest |

## Evaluation and Testing

Recommended AI evaluation cases:

| Case | Expected behavior |
| --- | --- |
| Technical issue | Category: technical/support, negative sentiment, high priority if blocking |
| Billing complaint | Category: billing, clear response with next-step language |
| Feature request | Category: feature request, neutral/positive sentiment, lower urgency |
| Screenshot included | Uses image context when relevant |
| Ambiguous ticket | Conservative classification and asks for missing information |

Run frontend tests:

```bash
cd frontend
npm test
```

Run backend tests:

```bash
cd backend
pytest tests/ -v
```

## Local Setup

Frontend:

```bash
git clone https://github.com/Praciller/customer-support-on-twitter.git
cd customer-support-on-twitter/frontend
npm install
npm start
```

Backend:

```bash
cd backend
pip install -r requirements.txt
export GOOGLE_API_KEY=your_gemini_key
python main.py
```

Local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## API

### POST `/analyze-ticket`

Input:

- `text`: ticket text
- `image`: optional screenshot/image attachment

Output:

- category
- sentiment
- priority
- suggested response

### GET `/health`

Returns backend and AI-service readiness.

## Deployment

The frontend demo is deployed to GitHub Pages:

```bash
cd frontend
npm run build
npm run deploy
```

For production AI analysis, deploy the FastAPI backend separately and configure the frontend with the backend API URL.

## Why This Repo Matters

This project is useful for AI Engineer and GenAI Engineer roles because it shows applied classification, extraction, and response generation in a support workflow. It also supports data analyst positioning because ticket categories, sentiment, and priority are operational metrics that can feed dashboards and routing decisions.

## License

MIT
