"""Deterministic local processor for customer-support ticket analysis."""

from typing import Any, Dict, Optional


def _is_thai(text: str) -> bool:
    return any("\u0e00" <= char <= "\u0e7f" for char in text)


def _contains(text: str, *keywords: str) -> bool:
    normalized = text.lower()
    return any(keyword in normalized for keyword in keywords)


def _english_result(ticket_text: str, has_image: bool) -> Dict[str, Any]:
    category = "General Inquiry"
    sentiment = "Neutral"
    priority = "Medium"

    if has_image and _contains(ticket_text, "damage", "broken", "defect", "crack", "product"):
        category, sentiment, priority = "Product Defect", "Concerned", "High"
    elif _contains(ticket_text, "bug", "error", "crash", "broken", "not working"):
        category, sentiment, priority = "Technical Issue", "Frustrated", "High"
    elif _contains(ticket_text, "bill", "charge", "payment", "refund"):
        category, priority = "Billing Question", "Medium"
    elif _contains(ticket_text, "feature", "suggestion", "improve"):
        category, sentiment, priority = "Feature Request", "Positive", "Low"
    elif _contains(ticket_text, "account", "login", "password"):
        category, priority = "Account Problem", "High"

    summary = (
        f"Customer reported a {category.lower()} with {sentiment.lower()} sentiment. "
        + ("Image attachment provided for additional context." if has_image else "Text-only submission.")
    )
    replies = {
        "Product Defect": "Thank you for reporting the product issue. Please provide the order number and any relevant photos so the support team can review replacement or refund options.",
        "Technical Issue": "Thank you for reporting the technical issue. The support team will review the details and provide troubleshooting steps or an escalation path.",
        "Billing Question": "Thank you for contacting us about the billing question. The support team will review the account details and provide a clear explanation or next step.",
        "Feature Request": "Thank you for the suggestion. The request will be recorded for product review and future prioritization.",
        "Account Problem": "Thank you for reporting the account issue. For security, identity verification may be required before account changes are made.",
        "General Inquiry": "Thank you for contacting support. The request has been received and can now be reviewed by the appropriate team.",
    }
    return {
        "summary": summary,
        "category": category,
        "sentiment": sentiment,
        "priority": priority,
        "draft_reply": replies[category],
        "analysis_mode": "deterministic-local",
        "image_interpretation": False,
    }


def _thai_result(ticket_text: str, has_image: bool) -> Dict[str, Any]:
    category = "คำถามทั่วไป"
    sentiment = "เป็นกลาง"
    priority = "ปานกลาง"

    if has_image and _contains(ticket_text, "เสียหาย", "ชำรุด", "แตก", "หัก", "พัง", "สินค้า"):
        category, sentiment, priority = "สินค้าชำรุด", "กังวล", "สูง"
    elif _contains(ticket_text, "ปัญหา", "ข้อผิดพลาด", "ใช้ไม่ได้", "พัง"):
        category, sentiment, priority = "ปัญหาทางเทคนิค", "หงุดหงิด", "สูง"
    elif _contains(ticket_text, "เงิน", "ค่าใช้จ่าย", "บิล", "ชำระเงิน", "คืนเงิน"):
        category = "คำถามเกี่ยวกับการเงิน"
    elif _contains(ticket_text, "ฟีเจอร์", "ข้อเสนอแนะ", "ปรับปรุง", "เพิ่ม"):
        category, sentiment, priority = "ขอฟีเจอร์ใหม่", "พอใจ", "ต่ำ"
    elif _contains(ticket_text, "บัญชี", "เข้าสู่ระบบ", "รหัสผ่าน"):
        category, priority = "ปัญหาบัญชี", "สูง"

    summary = (
        f"ลูกค้ารายงาน{category}ด้วยความรู้สึก{sentiment} "
        + ("มีไฟล์รูปภาพแนบเพื่อเป็นข้อมูลประกอบ" if has_image else "ส่งข้อความเท่านั้น")
    )
    replies = {
        "สินค้าชำรุด": "ขอบคุณที่แจ้งปัญหาสินค้า กรุณาแนบหมายเลขคำสั่งซื้อและรูปที่เกี่ยวข้องเพื่อให้ทีมงานตรวจสอบทางเลือกในการเปลี่ยนสินค้าหรือคืนเงิน",
        "ปัญหาทางเทคนิค": "ขอบคุณที่แจ้งปัญหาทางเทคนิค ทีมสนับสนุนจะตรวจสอบรายละเอียดและแจ้งขั้นตอนแก้ไขหรือการส่งต่อให้ทีมที่เกี่ยวข้อง",
        "คำถามเกี่ยวกับการเงิน": "ขอบคุณที่ติดต่อเรื่องค่าใช้จ่าย ทีมสนับสนุนจะตรวจสอบรายละเอียดและแจ้งคำอธิบายหรือขั้นตอนถัดไป",
        "ขอฟีเจอร์ใหม่": "ขอบคุณสำหรับข้อเสนอแนะ ทีมงานจะบันทึกคำขอไว้เพื่อพิจารณาในการจัดลำดับงานผลิตภัณฑ์",
        "ปัญหาบัญชี": "ขอบคุณที่แจ้งปัญหาบัญชี เพื่อความปลอดภัยอาจต้องยืนยันตัวตนก่อนดำเนินการเปลี่ยนแปลงบัญชี",
        "คำถามทั่วไป": "ขอบคุณที่ติดต่อทีมสนับสนุน ระบบได้รับคำขอแล้วและพร้อมส่งต่อให้ทีมที่เหมาะสมตรวจสอบ",
    }
    return {
        "summary": summary,
        "category": category,
        "sentiment": sentiment,
        "priority": priority,
        "draft_reply": replies[category],
        "analysis_mode": "deterministic-local",
        "image_interpretation": False,
    }


class LLMProcessor:
    """Compatibility wrapper around deterministic local ticket triage."""

    async def analyze_multimodal_ticket(
        self, ticket_text: str, image_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        if not ticket_text or not ticket_text.strip():
            raise ValueError("ticket_text is required")
        has_image = bool(image_bytes)
        if _is_thai(ticket_text):
            return _thai_result(ticket_text, has_image)
        return _english_result(ticket_text, has_image)


llm_processor = LLMProcessor()


async def analyze_multimodal_ticket(
    ticket_text: str, image_bytes: Optional[bytes] = None
) -> Dict[str, Any]:
    return await llm_processor.analyze_multimodal_ticket(ticket_text, image_bytes)
