"""
Multimodal LLM processor for customer support ticket analysis.
Uses Google Gemini 2.0 Flash model for text and image analysis.
"""

import io
import json
import logging
import os
from typing import Any, Dict, Optional

import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMProcessor:
    """Handles multimodal analysis of customer support tickets using Google Gemini."""

    def __init__(self):
        """Initialize the LLM processor with Google Gemini configuration."""
        try:
            # Configure Google Generative AI
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")

            genai.configure(api_key=api_key)

            # Initialize the model with generation configuration
            self.model = genai.GenerativeModel(
                "gemini-2.0-flash-exp",
                generation_config={"temperature": 0.3, "max_output_tokens": 2048},
            )

            logger.info("LLM Processor initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize LLM Processor: {str(e)}")
            raise

    def _prepare_image(self, image_bytes: bytes) -> Image.Image:
        """Convert image bytes to PIL Image object."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Convert to RGB if necessary
            if image.mode != "RGB":
                image = image.convert("RGB")
            return image
        except Exception as e:
            logger.error(f"Failed to process image: {str(e)}")
            raise ValueError(f"Invalid image format: {str(e)}")

    def _create_analysis_prompt(self) -> str:
        """Create the analysis prompt for the LLM."""
        return """
        Analyze this customer support request. If an image is provided, examine it carefully for:
        - Error messages or codes
        - UI/UX issues or bugs
        - Screenshots of problems
        - Product defects or issues
        - Any relevant visual context

        IMPORTANT: Detect the language of the customer's message and respond in the SAME language.
        If the customer writes in Thai, respond in Thai. If in English, respond in English.
        Maintain the same language throughout your entire response.

        You must respond with ONLY a valid JSON object. Do not include any other text, explanations, or formatting.

        Use this exact JSON structure:
        {
            "summary": "A concise 2-3 sentence summary of the customer's issue (in the same language as the customer's message)",
            "category": "One of: Technical Issue, Billing, Account Access, Product Defect, Feature Request, General Inquiry (translate to customer's language if needed)",
            "sentiment": "One of: Positive, Neutral, Negative, Frustrated (translate to customer's language if needed)",
            "priority": "One of: Low, Medium, High, Critical (translate to customer's language if needed)",
            "draft_reply": "A professional, empathetic response draft addressing the customer's concern (in the same language as the customer's message)"
        }

        Important: Return ONLY the JSON object, nothing else. All text fields must be in the same language as the customer's original message.
        """

    async def analyze_multimodal_ticket(
        self, ticket_text: str, image_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """
        Analyze a customer support ticket with optional image attachment.

        Args:
            ticket_text (str): The text content of the support ticket
            image_bytes (Optional[bytes]): Image attachment as bytes

        Returns:
            Dict[str, Any]: Analysis results with summary, category, sentiment, and draft reply
        """
        try:
            # Prepare the prompt
            prompt = self._create_analysis_prompt()

            # Prepare content for the model
            content = [prompt, f"\nCustomer Message: {ticket_text}"]

            # Add image if provided
            if image_bytes:
                try:
                    image = self._prepare_image(image_bytes)
                    content.append(image)
                    logger.info("Image successfully added to analysis")
                except Exception as e:
                    logger.warning(
                        f"Failed to process image, continuing with text-only analysis: {str(e)}"
                    )

            # Generate response
            logger.info("Sending request to Gemini model...")
            response = self.model.generate_content(content)

            # Parse JSON response
            try:
                response_text = response.text.strip()

                # Try to extract JSON from the response if it's wrapped in other text
                if response_text.startswith("```json"):
                    # Remove markdown code block formatting
                    response_text = (
                        response_text.replace("```json", "").replace("```", "").strip()
                    )
                elif response_text.startswith("```"):
                    # Remove generic code block formatting
                    response_text = response_text.replace("```", "").strip()

                # Find JSON object in the response
                start_idx = response_text.find("{")
                end_idx = response_text.rfind("}") + 1

                if start_idx != -1 and end_idx > start_idx:
                    json_text = response_text[start_idx:end_idx]
                    result = json.loads(json_text)
                else:
                    # Try parsing the entire response as JSON
                    result = json.loads(response_text)

                logger.info("Successfully analyzed ticket")

                # Validate required keys
                required_keys = [
                    "summary",
                    "category",
                    "sentiment",
                    "priority",
                    "draft_reply",
                ]
                for key in required_keys:
                    if key not in result:
                        result[key] = "Not available"

                return result

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {str(e)}")
                logger.error(f"Raw response: {response.text}")

                # Return fallback response
                # Try to detect if the original message was in Thai
                is_thai = any(ord(char) >= 0x0E00 and ord(char) <= 0x0E7F for char in ticket_text)

                if is_thai:
                    return {
                        "summary": "ไม่สามารถวิเคราะห์ตั้วอัตโนมัติได้ ต้องตรวจสอบด้วยตนเอง",
                        "category": "คำถามทั่วไป",
                        "sentiment": "เป็นกลาง",
                        "priority": "ปานกลาง",
                        "draft_reply": "ขอบคุณที่ติดต่อเรา เราได้รับข้อความของคุณแล้ว "
                        "และจะตรวจสอบในเร็วๆ นี้ ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด",
                    }
                else:
                    return {
                        "summary": "Unable to analyze ticket automatically. Manual review required.",
                        "category": "General Inquiry",
                        "sentiment": "Neutral",
                        "priority": "Medium",
                        "draft_reply": "Thank you for contacting us. We have received your message "
                        "and will review it shortly. Our team will get back to you as soon as possible.",
                    }

        except Exception as e:
            logger.error(f"Error during ticket analysis: {str(e)}")

            # Return error response
            # Try to detect if the original message was in Thai for error response
            is_thai = any(ord(char) >= 0x0E00 and ord(char) <= 0x0E7F for char in ticket_text)

            if is_thai:
                return {
                    "summary": f"การวิเคราะห์ล้มเหลว: {str(e)}",
                    "category": "คำถามทั่วไป",
                    "sentiment": "เป็นกลาง",
                    "priority": "ปานกลาง",
                    "draft_reply": "ขอบคุณที่ติดต่อเรา ขณะนี้เรากำลังประสบปัญหาทางเทคนิค "
                    "แต่เราจะตรวจสอบข้อความของคุณและตอบกลับโดยเร็วที่สุด",
                }
            else:
                return {
                    "summary": f"Analysis failed: {str(e)}",
                    "category": "General Inquiry",
                    "sentiment": "Neutral",
                    "priority": "Medium",
                    "draft_reply": "Thank you for contacting us. We are experiencing technical difficulties "
                    "but will review your message and respond as soon as possible.",
                }


# Global instance
llm_processor = LLMProcessor()


# Convenience function for external use
async def analyze_multimodal_ticket(
    ticket_text: str, image_bytes: Optional[bytes] = None
) -> Dict[str, Any]:
    """
    Convenience function to analyze a customer support ticket.

    Args:
        ticket_text (str): The text content of the support ticket
        image_bytes (Optional[bytes]): Image attachment as bytes

    Returns:
        Dict[str, Any]: Analysis results
    """
    return await llm_processor.analyze_multimodal_ticket(ticket_text, image_bytes)
