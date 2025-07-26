# Customer Support AI System

A multimodal Customer Support AI system that analyzes support tickets containing both text and images to automatically categorize issues, summarize problems, and generate accurate response drafts.

## Features

- **Multimodal Analysis**: Process both text and image attachments using Google Gemini 2.0 Flash
- **Automatic Categorization**: Classify tickets by category, sentiment, and priority
- **Smart Summarization**: Generate concise problem summaries
- **Draft Responses**: Create professional response drafts
- **Brutalist Design**: Clean, functional UI with strict brutalist design principles

## Project Structure

```
customer-support-on-twitter/
├── backend/
│   ├── dataset/
│   │   └── twcs.csv (Twitter Customer Service dataset)
│   ├── core/
│   │   └── llm_processor.py (AI processing logic)
│   ├── main.py (FastAPI application)
│   ├── requirements.txt
│   └── .env (environment configuration)
└── frontend/
    ├── src/
    │   ├── App.js (main React component)
    │   ├── index.js (React bootstrap)
    │   └── index.css (brutalist CSS)
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js (brutalist design system)
    └── postcss.config.js
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration:**
   - The `.env` file is already configured with the Google API key
   - Modify `ALLOWED_ORIGINS` if needed for different frontend URLs

4. **Start the FastAPI server:**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## API Endpoints

### POST `/analyze-ticket`
Analyze a customer support ticket with optional image attachment.

**Parameters:**
- `text` (form field, required): The customer support ticket text
- `image` (file upload, optional): Image attachment (max 10MB)

**Response:**
```json
{
  "summary": "Concise problem summary",
  "category": "Technical Issue | Billing | Account Access | Product Defect | Feature Request | General Inquiry",
  "sentiment": "Positive | Neutral | Negative | Frustrated",
  "priority": "Low | Medium | High | Critical",
  "draft_reply": "Professional response draft",
  "metadata": {
    "has_image": true,
    "image_filename": "screenshot.png",
    "text_length": 150,
    "processed_at": "2025-01-24T00:00:00Z"
  }
}
```

### GET `/health`
Health check endpoint for monitoring API status.

## Design System

The frontend follows strict **Brutalist Design** principles:

- **Typography**: Monospace fonts only (Courier New, Monaco, Lucida Console)
- **Colors**: Pure black (#000000), white (#FFFFFF), light gray (#F5F5F5) only
- **Borders**: 4px solid black for containers, 2px solid black for form elements
- **Layout**: CSS Grid, no flexbox
- **Text**: ALL HEADINGS IN UPPERCASE AND BOLD
- **Spacing**: Only 20px, 40px, 60px, 80px increments
- **NO**: Rounded corners, gradients, shadows, or smooth transitions
- **Interactions**: Instant color inversion on hover (black↔white)

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Google Gemini 2.0 Flash**: Multimodal AI model
- **Pillow**: Image processing
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework (configured for brutalism)
- **Axios**: HTTP client for API communication

## Usage

1. **Start both backend and frontend servers** (see setup instructions above)
2. **Open the application** at `http://localhost:3000`
3. **Enter ticket text** in the textarea
4. **Optionally upload an image** (screenshots, error messages, etc.)
5. **Click "ANALYZE TICKET"** to process the request
6. **View results** in the structured cards below

## Dataset

The `backend/dataset/twcs.csv` file contains the Twitter Customer Service dataset for reference and testing purposes.

## Error Handling

- **File validation**: Only image files up to 10MB are accepted
- **API errors**: Graceful error handling with user-friendly messages
- **Fallback responses**: System provides default responses if AI analysis fails

## Development Notes

- The system uses Google Gemini 2.0 Flash for multimodal analysis
- JSON response format ensures consistent API responses
- CORS is configured for local development
- The brutalist design system is enforced through Tailwind configuration
- All animations and transitions are disabled for true brutalist aesthetics
