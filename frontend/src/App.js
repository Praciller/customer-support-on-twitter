import React, { useState } from "react";
import axios from "axios";
import "./index.css";

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

const DEMO_MODE =
  process.env.NODE_ENV === "production" ||
  window.location.hostname.includes("github.io");
const API_BASE_URL = DEMO_MODE ? null : "http://localhost:8000";

export const generateDemoResponse = (ticketText, hasImage) => {
  const isThai = /[\u0E00-\u0E7F]/.test(ticketText);
  const text = ticketText.toLowerCase();

  let category = isThai ? "คำถามทั่วไป" : "General Inquiry";
  let sentiment = isThai ? "เป็นกลาง" : "Neutral";
  let priority = isThai ? "ปานกลาง" : "Medium";

  if (isThai) {
    if (
      hasImage &&
      ["เสียหาย", "ชำรุด", "แตก", "หัก", "พัง", "สินค้า"].some((word) =>
        text.includes(word)
      )
    ) {
      category = "สินค้าชำรุด";
      sentiment = "กังวล";
      priority = "สูง";
    } else if (["ปัญหา", "ข้อผิดพลาด", "ใช้ไม่ได้", "พัง"].some((word) => text.includes(word))) {
      category = "ปัญหาทางเทคนิค";
      sentiment = "หงุดหงิด";
      priority = "สูง";
    } else if (["เงิน", "ค่าใช้จ่าย", "บิล", "ชำระเงิน", "คืนเงิน"].some((word) => text.includes(word))) {
      category = "คำถามเกี่ยวกับการเงิน";
    } else if (["ฟีเจอร์", "ข้อเสนอแนะ", "ปรับปรุง", "เพิ่ม"].some((word) => text.includes(word))) {
      category = "ขอฟีเจอร์ใหม่";
      sentiment = "พอใจ";
      priority = "ต่ำ";
    } else if (["บัญชี", "เข้าสู่ระบบ", "รหัสผ่าน"].some((word) => text.includes(word))) {
      category = "ปัญหาบัญชี";
      priority = "สูง";
    }
  } else if (
    hasImage &&
    ["damage", "broken", "defect", "crack", "product"].some((word) =>
      text.includes(word)
    )
  ) {
    category = "Product Defect";
    sentiment = "Concerned";
    priority = "High";
  } else if (["bug", "error", "crash", "not working"].some((word) => text.includes(word))) {
    category = "Technical Issue";
    sentiment = "Frustrated";
    priority = "High";
  } else if (["bill", "charge", "payment", "refund"].some((word) => text.includes(word))) {
    category = "Billing Question";
  } else if (["feature", "suggestion", "improve"].some((word) => text.includes(word))) {
    category = "Feature Request";
    sentiment = "Positive";
    priority = "Low";
  } else if (["account", "login", "password"].some((word) => text.includes(word))) {
    category = "Account Problem";
    priority = "High";
  }

  const summary = isThai
    ? `ลูกค้ารายงาน${category}ด้วยความรู้สึก${sentiment} ${
        hasImage ? "มีไฟล์รูปภาพแนบเพื่อเป็นข้อมูลประกอบ" : "ส่งข้อความเท่านั้น"
      }`
    : `Customer reported a ${category.toLowerCase()} with ${sentiment.toLowerCase()} sentiment. ${
        hasImage
          ? "Image attachment provided for additional context."
          : "Text-only submission."
      }`;

  const draftReply = isThai
    ? "ขอบคุณที่ติดต่อทีมสนับสนุน ระบบได้รับคำขอแล้วและพร้อมส่งต่อให้ทีมที่เหมาะสมตรวจสอบ กรุณาตรวจสอบข้อมูลสำคัญก่อนส่งคำตอบให้ลูกค้า"
    : "Thank you for contacting support. The request has been received and is ready for review by the appropriate team. Please verify important details before sending the draft response.";

  return {
    summary,
    category,
    sentiment,
    priority,
    draft_reply: draftReply,
    analysis_mode: "deterministic-local",
    image_interpretation: false,
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
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file too large. Maximum size is 10MB.");
      return;
    }
    setSelectedImage(file);
    setError(null);
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnalysisResult(generateDemoResponse(ticketText, Boolean(selectedImage)));
      } else {
        const formData = new FormData();
        formData.append("text", ticketText);
        if (selectedImage) formData.append("image", selectedImage);
        const response = await axios.post(`${API_BASE_URL}/analyze-ticket`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAnalysisResult(response.data);
      }
    } catch (requestError) {
      console.error("Error analyzing ticket:", requestError);
      setAnalysisResult(generateDemoResponse(ticketText, Boolean(selectedImage)));
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setTicketText("");
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <h1 className="text-4xl font-bold text-center">CUSTOMER SUPPORT AI SYSTEM</h1>
            <CardDescription className="text-center text-lg">
              MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING
            </CardDescription>
          </CardHeader>
          {DEMO_MODE && (
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-bold text-yellow-800">🚀 DEMO MODE ACTIVE</p>
                <p className="text-sm text-yellow-700 mt-2">
                  This public demo uses deterministic local ticket triage. Image uploads are acknowledged as context but image pixels are not interpreted.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">SUBMIT SUPPORT TICKET</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ticket-text">TICKET TEXT *</Label>
                <Textarea
                  id="ticket-text"
                  value={ticketText}
                  onChange={(event) => setTicketText(event.target.value)}
                  placeholder="DESCRIBE YOUR ISSUE HERE..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-upload">IMAGE ATTACHMENT (OPTIONAL)</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <p className="text-sm text-muted-foreground">SELECTED: {selectedImage.name}</p>
                )}
              </div>
              {error && <p className="font-bold text-destructive">ERROR: {error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "ANALYZING..." : "ANALYZE TICKET"}
                </Button>
                <Button type="button" variant="outline" onClick={clearForm}>CLEAR FORM</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {analysisResult && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader><h3 className="text-lg font-semibold">SUMMARY</h3></CardHeader>
                <CardContent><p className="text-sm">{analysisResult.summary}</p></CardContent>
              </Card>
              <Card>
                <CardHeader><h3 className="text-lg font-semibold">CATEGORY & SENTIMENT</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div><span className="font-bold">CATEGORY: </span><span>{analysisResult.category}</span></div>
                  <div><span className="font-bold">SENTIMENT: </span><span>{analysisResult.sentiment}</span></div>
                  <div><span className="font-bold">PRIORITY: </span><span>{analysisResult.priority}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><h3 className="text-lg font-semibold">DRAFT REPLY</h3></CardHeader>
                <CardContent><p className="text-sm">{analysisResult.draft_reply}</p></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><h3 className="text-lg font-semibold">BACKEND TECHNOLOGY STACK</h3></CardHeader>
              <CardContent className="space-y-2">
                <p><strong>AI & PROCESSING:</strong> Deterministic local ticket triage</p>
                <p><strong>INFRASTRUCTURE:</strong> FastAPI Python backend</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
