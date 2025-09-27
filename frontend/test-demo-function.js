// Test the generateDemoResponse function directly
const generateDemoResponse = (ticketText, hasImage) => {
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

console.log('Testing Thai text: ความเสียหาย');
const thaiResult = generateDemoResponse('ความเสียหาย', false);
console.log('Thai result:', JSON.stringify(thaiResult, null, 2));

console.log('\nTesting English text: My account is broken');
const englishResult = generateDemoResponse('My account is broken', false);
console.log('English result:', JSON.stringify(englishResult, null, 2));

console.log('\nTesting Thai technical issue: ระบบเสียใช้ไม่ได้');
const thaiTechResult = generateDemoResponse('ระบบเสียใช้ไม่ได้', false);
console.log('Thai tech result:', JSON.stringify(thaiTechResult, null, 2));
