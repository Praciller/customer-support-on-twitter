import React, { useState } from "react";
import axios from "axios";
import "./index.css";

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
      const formData = new FormData();
      formData.append("text", ticketText);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        "http://localhost:8000/analyze-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysisResult(response.data);
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
                  <span className="brutal-text">{analysisResult.category}</span>
                </div>
                <div>
                  <span className="brutal-text font-bold">SENTIMENT: </span>
                  <span className="brutal-text">
                    {analysisResult.sentiment}
                  </span>
                </div>
                <div>
                  <span className="brutal-text font-bold">PRIORITY: </span>
                  <span className="brutal-text">{analysisResult.priority}</span>
                </div>
              </div>
            </div>

            {/* Draft Reply Card */}
            <div className="brutal-card">
              <h3 className="brutal-subheading text-lg">DRAFT REPLY</h3>
              <p className="brutal-text">{analysisResult.draft_reply}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
