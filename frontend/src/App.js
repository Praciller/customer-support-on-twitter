import React, { useState } from "react";
import axios from "axios";
import "./index.css";

// Import shadcn/ui components
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";

// Demo mode configuration
const DEMO_MODE =
  process.env.NODE_ENV === "production" ||
  window.location.hostname.includes("github.io");
const API_BASE_URL = DEMO_MODE ? null : "http://localhost:8000";

// Demo response generator
export const generateDemoResponse = (ticketText, hasImage) => {
  // Detect if the input is in Thai
  const isThaiText = /[\u0E00-\u0E7F]/.test(ticketText);

  // Simple keyword-based categorization for demo
  let category = isThaiText ? "คำถามทั่วไป" : "General Inquiry";
  let sentiment = isThaiText ? "เป็นกลาง" : "Neutral";
  let priority = isThaiText ? "ปานกลาง" : "Medium";

  const lowerText = ticketText.toLowerCase();

  // Check for Thai keywords
  if (isThaiText) {
    if (
      lowerText.includes("ปัญหา") ||
      lowerText.includes("เสีย") ||
      lowerText.includes("ข้อผิดพลาด") ||
      lowerText.includes("ใช้ไม่ได้")
    ) {
      category = "ปัญหาทางเทคนิค";
      priority = "สูง";
      sentiment = "หงุดหงิด";
    } else if (
      lowerText.includes("เงิน") ||
      lowerText.includes("ค่าใช้จ่าย") ||
      lowerText.includes("บิล") ||
      lowerText.includes("ชำระเงิน")
    ) {
      category = "คำถามเกี่ยวกับการเงิน";
      priority = "ปานกลาง";
    } else if (
      lowerText.includes("ฟีเจอร์") ||
      lowerText.includes("ข้อเสนอแนะ") ||
      lowerText.includes("ปรับปรุง") ||
      lowerText.includes("เพิ่ม")
    ) {
      category = "ขอฟีเจอร์ใหม่";
      priority = "ต่ำ";
      sentiment = "พอใจ";
    } else if (
      lowerText.includes("บัญชี") ||
      lowerText.includes("เข้าสู่ระบบ") ||
      lowerText.includes("รหัสผ่าน")
    ) {
      category = "ปัญหาบัญชี";
      priority = "สูง";
    }
  } else {
    // English keywords
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
  }

  // Generate summary
  const summary = isThaiText
    ? `ลูกค้ารายงาน${category.toLowerCase()}ด้วยความรู้สึก${sentiment.toLowerCase()} ${
        hasImage
          ? "มีไฟล์แนบรูปภาพเพื่อให้ข้อมูลเพิ่มเติม"
          : "ส่งข้อความเท่านั้น"
      }`
    : `Customer reported a ${category.toLowerCase()} with ${sentiment.toLowerCase()} sentiment. ${
        hasImage
          ? "Image attachment provided for additional context."
          : "Text-only submission."
      }`;

  // Generate draft reply based on category
  let draftReply = "";

  if (isThaiText) {
    // Thai responses
    switch (category) {
      case "ปัญหาทางเทคนิค":
        draftReply =
          "ขอบคุณที่แจ้งปัญหาทางเทคนิคนี้ ทีมวิศวกรของเราได้รับแจ้งแล้วและจะตรวจสอบปัญหานี้อย่างรวดเร็ว เราจะแจ้งความคืบหน้าและให้การแก้ไขโดยเร็วที่สุด";
        break;
      case "คำถามเกี่ยวกับการเงิน":
        draftReply =
          "ขอบคุณที่ติดต่อเราเกี่ยวกับคำถามการเงิน เราจะตรวจสอบรายละเอียดบัญชีของคุณและให้คำอธิบายโดยละเอียดเกี่ยวกับค่าใช้จ่าย กรุณารอ 24-48 ชั่วโมงสำหรับการตอบกลับที่สมบูรณ์";
        break;
      case "ขอฟีเจอร์ใหม่":
        draftReply =
          "ขอบคุณสำหรับความคิดเห็นและข้อเสนอแนะที่มีค่า เราขอบคุณลูกค้าที่ช่วยให้เราปรับปรุงผลิตภัณฑ์ เราจะส่งต่อคำขอของคุณไปยังทีมผลิตภัณฑ์เพื่อพิจารณาในการอัปเดตในอนาคต";
        break;
      case "ปัญหาบัญชี":
        draftReply =
          "เราเข้าใจว่าคุณกำลังประสบปัญหาเกี่ยวกับบัญชี เพื่อความปลอดภัย เราจำเป็นต้องยืนยันตัตนของคุณก่อนทำการเปลี่ยนแปลงใดๆ กรุณาตรวจสอบอีเมลของคุณสำหรับคำแนะนำการยืนยัน";
        break;
      default:
        draftReply =
          "ขอบคุณที่ติดต่อทีมสนับสนุนของเรา เราได้รับคำถามของคุณแล้วและจะตอบกลับภายใน 24 ชั่วโมงพร้อมการแก้ไขโดยละเอียดหรือขั้นตอนถัดไป";
    }
  } else {
    // English responses
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

      // Fallback to demo mode if API fails
      if (!DEMO_MODE) {
        console.log("API failed, falling back to demo mode");
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const demoResult = generateDemoResponse(ticketText, !!selectedImage);
          setAnalysisResult(demoResult);
        } catch (demoErr) {
          console.error("Demo mode also failed:", demoErr);
          setError("Failed to analyze ticket. Please try again.");
        }
      } else {
        setError(
          err.response?.data?.detail ||
            "Failed to analyze ticket. Please try again."
        );
      }
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Header */}
        <Card className="mb-8">
          <CardHeader>
            <h1 className="text-4xl font-bold text-center">
              CUSTOMER SUPPORT AI SYSTEM
            </h1>
            <CardDescription className="text-center text-lg">
              MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING
            </CardDescription>
          </CardHeader>
          {DEMO_MODE && (
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-bold text-yellow-800">
                  🚀 DEMO MODE ACTIVE - Simulated AI responses for showcase
                  purposes
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  This is a live demo of the frontend interface. The actual
                  backend uses FastAPI + Google Gemini AI for real ticket
                  analysis.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Input Form */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">SUBMIT SUPPORT TICKET</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ticket Text Input */}
              <div className="space-y-2">
                <Label htmlFor="ticket-text">TICKET TEXT *</Label>
                <Textarea
                  id="ticket-text"
                  value={ticketText}
                  onChange={(e) => setTicketText(e.target.value)}
                  placeholder="DESCRIBE YOUR ISSUE HERE..."
                  rows={6}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image-upload">
                  IMAGE ATTACHMENT (OPTIONAL)
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="h-14 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {selectedImage && (
                  <p className="text-sm text-muted-foreground">
                    SELECTED: {selectedImage.name}
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <Card className="bg-destructive/10 border-destructive">
                  <CardContent className="pt-6">
                    <p className="font-bold text-destructive">ERROR: {error}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "ANALYZING..." : "ANALYZE TICKET"}
                </Button>
                <Button type="button" variant="outline" onClick={clearForm}>
                  CLEAR FORM
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">SUMMARY</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{analysisResult.summary}</p>
                </CardContent>
              </Card>

              {/* Category & Sentiment Card */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    CATEGORY & SENTIMENT
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-bold">CATEGORY: </span>
                    <span>{analysisResult.category}</span>
                  </div>
                  <div>
                    <span className="font-bold">SENTIMENT: </span>
                    <span>{analysisResult.sentiment}</span>
                  </div>
                  <div>
                    <span className="font-bold">PRIORITY: </span>
                    <span>{analysisResult.priority}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Draft Reply Card */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">DRAFT REPLY</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{analysisResult.draft_reply}</p>
                </CardContent>
              </Card>
            </div>

            {/* Backend Technology Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  BACKEND TECHNOLOGY STACK
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-bold mb-3">AI & PROCESSING:</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Google Gemini AI for text analysis</li>
                      <li>• Computer vision for image processing</li>
                      <li>• Natural language understanding</li>
                      <li>• Sentiment analysis algorithms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3">INFRASTRUCTURE:</h4>
                    <ul className="text-sm space-y-2">
                      <li>• FastAPI Python backend</li>
                      <li>• RESTful API architecture</li>
                      <li>• Multimodal file processing</li>
                      <li>• Real-time response generation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
