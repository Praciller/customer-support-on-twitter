import React, { useState } from "react";
import axios from "axios";
import "./index.css";

// Demo mode configuration
const DEMO_MODE =
  process.env.NODE_ENV === "production" ||
  window.location.hostname.includes("github.io");
const API_BASE_URL = DEMO_MODE ? null : "http://localhost:8000";

// Demo response generator
const generateDemoResponse = (ticketText, hasImage) => {
  // Available options for demo classification
  // const categories = [
  //   "Technical Issue",
  //   "Billing Question",
  //   "Feature Request",
  //   "Account Problem",
  //   "General Inquiry",
  // ];
  // const sentiments = [
  //   "Positive",
  //   "Neutral",
  //   "Negative",
  //   "Frustrated",
  //   "Satisfied",
  // ];
  // const priorities = ["Low", "Medium", "High", "Critical"];

  // Simple keyword-based categorization for demo
  let category = "General Inquiry";
  let sentiment = "Neutral";
  let priority = "Medium";

  const lowerText = ticketText.toLowerCase();

  if (
    lowerText.includes("bug") ||
    lowerText.includes("error") ||
    lowerText.includes("broken")
  ) {
    category = "Technical Issue";
    priority = "High";
    sentiment = "Frustrated";
  } else if (
    lowerText.includes("bill") ||
    lowerText.includes("charge") ||
    lowerText.includes("payment")
  ) {
    category = "Billing Question";
    priority = "Medium";
  } else if (
    lowerText.includes("feature") ||
    lowerText.includes("suggestion") ||
    lowerText.includes("improve")
  ) {
    category = "Feature Request";
    priority = "Low";
    sentiment = "Positive";
  } else if (
    lowerText.includes("account") ||
    lowerText.includes("login") ||
    lowerText.includes("password")
  ) {
    category = "Account Problem";
    priority = "High";
  }

  // Generate summary
  const summary = `Customer reported a ${category.toLowerCase()} with ${sentiment.toLowerCase()} sentiment. ${
    hasImage
      ? "Image attachment provided for additional context."
      : "Text-only submission."
  }`;

  // Generate draft reply based on category
  let draftReply = "";
  switch (category) {
    case "Technical Issue":
      draftReply =
        "Thank you for reporting this technical issue. Our engineering team has been notified and will investigate this matter promptly. We'll keep you updated on our progress and provide a resolution as soon as possible.";
      break;
    case "Billing Question":
      draftReply =
        "Thank you for contacting us about your billing inquiry. I'll review your account details and provide you with a detailed explanation of the charges. Please allow 24-48 hours for a complete response.";
      break;
    case "Feature Request":
      draftReply =
        "Thank you for your valuable feedback and feature suggestion. We appreciate customers who help us improve our product. I'll forward your request to our product team for consideration in future updates.";
      break;
    case "Account Problem":
      draftReply =
        "I understand you're experiencing account-related difficulties. For security purposes, I'll need to verify your identity before making any changes. Please check your email for verification instructions.";
      break;
    default:
      draftReply =
        "Thank you for contacting our support team. We've received your inquiry and will respond within 24 hours with a detailed solution or next steps.";
  }

  return {
    summary,
    category,
    sentiment,
    priority,
    draft_reply: draftReply,
    processing_time: "0.8s",
    confidence_score: "94%",
  };
};

function App() {
  const [ticketText, setTicketText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file too large. Maximum size is 10MB.");
        return;
      }
      setSelectedImage(file);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ticketText.trim()) {
      setError("Please enter ticket text");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      if (DEMO_MODE) {
        // Demo mode: simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const demoResult = generateDemoResponse(ticketText, !!selectedImage);
        setAnalysisResult(demoResult);
      } else {
        // Production mode: actual API call
        const formData = new FormData();
        formData.append("text", ticketText);

        if (selectedImage) {
          formData.append("image", selectedImage);
        }

        const response = await axios.post(
          `${API_BASE_URL}/analyze-ticket`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setAnalysisResult(response.data);
      }
    } catch (err) {
      console.error("Error analyzing ticket:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to analyze ticket. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setTicketText("");
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white p-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Header */}
        <div className="brutal-container mb-40">
          <h1 className="brutal-heading text-4xl">
            CUSTOMER SUPPORT AI SYSTEM
          </h1>
          <p className="brutal-text">
            MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING
          </p>
          {DEMO_MODE && (
            <div className="mt-20 p-20 bg-yellow-100 border-4 border-black">
              <p className="brutal-text font-bold">
                🚀 DEMO MODE ACTIVE - Simulated AI responses for showcase
                purposes
              </p>
              <p className="brutal-text text-sm mt-10">
                This is a live demo of the frontend interface. The actual
                backend uses FastAPI + Google Gemini AI for real ticket
                analysis.
              </p>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="brutal-container mb-40">
          <h2 className="brutal-subheading">SUBMIT SUPPORT TICKET</h2>

          <form onSubmit={handleSubmit} className="grid gap-20">
            {/* Ticket Text Input */}
            <div>
              <label htmlFor="ticket-text" className="brutal-label">
                TICKET TEXT *
              </label>
              <textarea
                id="ticket-text"
                value={ticketText}
                onChange={(e) => setTicketText(e.target.value)}
                placeholder="DESCRIBE YOUR ISSUE HERE..."
                className="brutal-input"
                rows="6"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image-upload" className="brutal-label">
                IMAGE ATTACHMENT (OPTIONAL)
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="brutal-input"
              />
              {selectedImage && (
                <p className="brutal-text mt-20">
                  SELECTED: {selectedImage.name}
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="brutal-card bg-gray-100">
                <p className="brutal-text font-bold">ERROR: {error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-20">
              <button
                type="submit"
                disabled={isLoading}
                className="brutal-button"
              >
                {isLoading ? "ANALYZING..." : "ANALYZE TICKET"}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="brutal-button bg-white text-black border-black hover:bg-black hover:text-white"
              >
                CLEAR FORM
              </button>
            </div>
          </form>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-20">
            <div className="grid gap-20 md:grid-cols-3">
              {/* Summary Card */}
              <div className="brutal-card">
                <h3 className="brutal-subheading text-lg">SUMMARY</h3>
                <p className="brutal-text">{analysisResult.summary}</p>
              </div>

              {/* Category & Sentiment Card */}
              <div className="brutal-card">
                <h3 className="brutal-subheading text-lg">
                  CATEGORY & SENTIMENT
                </h3>
                <div className="space-y-20">
                  <div>
                    <span className="brutal-text font-bold">CATEGORY: </span>
                    <span className="brutal-text">
                      {analysisResult.category}
                    </span>
                  </div>
                  <div>
                    <span className="brutal-text font-bold">SENTIMENT: </span>
                    <span className="brutal-text">
                      {analysisResult.sentiment}
                    </span>
                  </div>
                  <div>
                    <span className="brutal-text font-bold">PRIORITY: </span>
                    <span className="brutal-text">
                      {analysisResult.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Draft Reply Card */}
              <div className="brutal-card">
                <h3 className="brutal-subheading text-lg">DRAFT REPLY</h3>
                <p className="brutal-text">{analysisResult.draft_reply}</p>
              </div>
            </div>

            {/* Backend Technology Info */}
            <div className="brutal-container">
              <h3 className="brutal-subheading text-lg">
                BACKEND TECHNOLOGY STACK
              </h3>
              <div className="grid gap-20 md:grid-cols-2">
                <div>
                  <h4 className="brutal-text font-bold mb-10">
                    AI & PROCESSING:
                  </h4>
                  <ul className="brutal-text space-y-5">
                    <li>• Google Gemini AI for text analysis</li>
                    <li>• Computer vision for image processing</li>
                    <li>• Natural language understanding</li>
                    <li>• Sentiment analysis algorithms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="brutal-text font-bold mb-10">
                    INFRASTRUCTURE:
                  </h4>
                  <ul className="brutal-text space-y-5">
                    <li>• FastAPI Python backend</li>
                    <li>• RESTful API architecture</li>
                    <li>• Multimodal file processing</li>
                    <li>• Real-time response generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
