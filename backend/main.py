"""
FastAPI application for multimodal customer support ticket analysis.
Provides REST API endpoints for analyzing support tickets with text and images.
"""

import logging
import os
from typing import Any, Dict, Optional

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.llm_processor import analyze_multimodal_ticket

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Customer Support AI API",
    description="Multimodal AI system for analyzing customer support tickets",
    version="1.0.0",
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Customer Support AI API is running",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    try:
        # Test if we can import the LLM processor
        from core.llm_processor import llm_processor

        # Check if the processor is properly initialized
        processor_status = "initialized" if llm_processor else "failed"

        return {
            "status": "healthy",
            "api": "operational",
            "llm_processor": processor_status,
            "timestamp": "2025-01-24T00:00:00Z",
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": "2025-01-24T00:00:00Z",
            },
        )


@app.post("/analyze-ticket")
async def analyze_ticket(
    text: str = Form(..., description="The customer support ticket text"),
    image: Optional[UploadFile] = File(None, description="Optional image attachment"),
) -> Dict[str, Any]:
    """
    Analyze a customer support ticket with optional image attachment.

    Args:
        text (str): The text content of the support ticket
        image (Optional[UploadFile]): Optional image file attachment

    Returns:
        Dict[str, Any]: Analysis results including summary, category, sentiment, and draft reply
    """
    try:
        # Validate input
        if not text or text.strip() == "":
            raise HTTPException(
                status_code=400, detail="Ticket text is required and cannot be empty"
            )

        # Process image if provided
        image_bytes = None
        if image:
            # Validate file type
            if not image.content_type or not image.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Please upload an image file.",
                )

            # Check file size (limit to 10MB)
            content = await image.read()
            if len(content) > 10 * 1024 * 1024:  # 10MB
                raise HTTPException(
                    status_code=400,
                    detail="Image file too large. Maximum size is 10MB.",
                )

            image_bytes = content
            logger.info(f"Processing ticket with image attachment: {image.filename}")
        else:
            logger.info("Processing text-only ticket")

        # Analyze the ticket
        result = await analyze_multimodal_ticket(text, image_bytes)

        # Add metadata
        result["metadata"] = {
            "has_image": image is not None,
            "image_filename": image.filename if image else None,
            "text_length": len(text),
            "processed_at": "2025-01-24T00:00:00Z",
        }

        logger.info("Ticket analysis completed successfully")
        return result

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error analyzing ticket: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/analyze-ticket-batch")
async def analyze_ticket_batch(tickets: list[dict]) -> Dict[str, Any]:
    """
    Analyze multiple tickets in batch (for future enhancement).

    Args:
        tickets (list[dict]): List of ticket objects with text and optional image data

    Returns:
        Dict[str, Any]: Batch analysis results
    """
    # This is a placeholder for future batch processing functionality
    return {
        "message": "Batch processing not yet implemented",
        "ticket_count": len(tickets),
        "status": "pending",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later.",
            "timestamp": "2025-01-24T00:00:00Z",
        },
    )


if __name__ == "__main__":
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"

    logger.info(f"Starting Customer Support AI API on {host}:{port}")

    uvicorn.run("main:app", host=host, port=port, reload=debug, log_level="info")
