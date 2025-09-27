# 🤖 Customer Support AI System

**🚀 [Live Demo](https://praciller.github.io/customer-support-on-twitter)**

An intelligent, multimodal customer support system that analyzes support tickets (text + images) and generates contextual responses using Google's Gemini AI model. Features a modern shadcn/ui design with comprehensive testing and real-time AI processing capabilities.

## ✨ Features

### 🎯 **Core Functionality**

- **Multimodal Analysis**: Process both text and image attachments
- **AI-Powered Categorization**: Automatic ticket classification
- **Sentiment Analysis**: Real-time emotion detection
- **Priority Assessment**: Intelligent urgency evaluation
- **Draft Response Generation**: Context-aware reply suggestions
- **Real-time Processing**: Sub-second response times

### 🎨 **User Experience**

- **Modern shadcn/ui Design**: Professional, accessible component library
- **Responsive Layout**: Mobile-first design that works on all devices
- **Live Demo Mode**: Interactive showcase without backend dependency
- **Real-time Feedback**: Loading states and comprehensive error handling
- **Accessibility**: WCAG compliant with proper semantic HTML

### 🔧 **Technical Stack**

- **Frontend**: React 18, shadcn/ui, Tailwind CSS, Axios
- **Backend**: FastAPI, Python 3.10+
- **AI Engine**: Google Gemini AI
- **Deployment**: GitHub Pages, GitHub Actions
- **Testing**: Jest, React Testing Library, Playwright, pytest

## 🚀 Live Demo

Experience the system in action: **[https://praciller.github.io/customer-support-on-twitter](https://praciller.github.io/customer-support-on-twitter)**

The live demo runs in **demo mode** with simulated AI responses that showcase the interface and functionality. The actual backend uses Google Gemini AI for real ticket analysis.

### 🧪 Try These Examples:

**Technical Issue:**

```
My app keeps crashing when I try to upload files. This is very frustrating!
```

**Billing Question:**

```
I was charged twice for my subscription this month. Can you help me understand why?
```

**Feature Request:**

```
It would be great if you could add dark mode to the application.
```

## 📁 Project Structure

```
customer-support-on-twitter/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.js           # Main component with demo mode
│   │   ├── index.css        # Brutalist styling
│   │   └── App.test.js      # Component tests
│   ├── public/              # Static assets
│   └── package.json         # Dependencies & scripts
├── backend/                 # FastAPI application
│   ├── main.py             # API server
│   ├── requirements.txt    # Python dependencies
│   └── tests/              # Backend tests
├── .github/workflows/      # GitHub workflows
│   └── dependency-update.yml # Dependency updates
└── README.md              # This file
```

## 🛠️ Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Google API Key** (for Gemini AI)

### Frontend Development

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

### Backend Development

```bash
cd backend
pip install -r requirements.txt
export GOOGLE_API_KEY="your-api-key"
python main.py
```

Runs on `http://localhost:8000`

### Full Stack Development

1. Start backend server (port 8000)
2. Start frontend development server (port 3000)
3. Frontend automatically connects to backend API

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Code Quality

```bash
# Python formatting & linting
black backend/
isort backend/
flake8 backend/

# Frontend linting (if configured)
cd frontend && npm run lint
```

## 🚀 Deployment

### GitHub Pages Deployment

```bash
cd frontend
npm run build
npm run deploy
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**

```env
GOOGLE_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

**Frontend:**

- Demo mode automatically activates on GitHub Pages
- Production builds use `REACT_APP_API_URL` for backend connection

## 📖 API Documentation

### Endpoints

**POST /analyze-ticket**

- **Description**: Analyze support ticket with text and optional image
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `text` (required): Ticket description
  - `image` (optional): Image attachment
- **Response**: Analysis results with category, sentiment, priority, and draft reply

**GET /health**

- **Description**: Health check endpoint
- **Response**: Service status and API availability

**GET /**

- **Description**: API information
- **Response**: Welcome message and API details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **React & FastAPI** for robust framework foundations
- **Tailwind CSS** for utility-first styling
- **GitHub Pages** for reliable hosting

---

**Built with ❤️ by [Praciller](https://github.com/Praciller)**
