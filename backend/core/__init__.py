"""
Core modules for the Customer Support AI system.

This package contains the core functionality for processing customer support tickets
using multimodal AI analysis.
"""

from .llm_processor import analyze_multimodal_ticket, llm_processor

__all__ = ["analyze_multimodal_ticket", "llm_processor"]
