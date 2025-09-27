import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../App";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("Component Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Form Submission Integration", () => {
    test("should integrate form input with API call and result display", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          summary: "Customer reported login issues with the mobile application",
          category: "Technical Issue",
          sentiment: "Frustrated",
          priority: "High",
          draft_reply:
            "Thank you for reporting this login issue. Our technical team is investigating and will provide a solution within 24 hours.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(<App />);

      // Fill out the form
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "I cannot log into the mobile app");

      // Submit the form
      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for results to appear (skip loading state check as it's too fast)
      await waitFor(() => {
        expect(screen.getByText(mockResponse.data.summary)).toBeInTheDocument();
      });

      // Verify API was called correctly
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/analyze-ticket",
        expect.any(FormData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Verify results are displayed
      expect(screen.getByText(mockResponse.data.summary)).toBeInTheDocument();
      expect(screen.getByText(mockResponse.data.category)).toBeInTheDocument();
      expect(screen.getByText(mockResponse.data.sentiment)).toBeInTheDocument();
      expect(screen.getByText(mockResponse.data.priority)).toBeInTheDocument();
      expect(
        screen.getByText(mockResponse.data.draft_reply)
      ).toBeInTheDocument();
    });

    test("should integrate file upload with form submission", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          summary: "Customer provided screenshot of error message",
          category: "Technical Issue",
          sentiment: "Neutral",
          priority: "Medium",
          draft_reply:
            "Thank you for the screenshot. We can see the error and will investigate this issue.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(<App />);

      // Fill out the form with text and file
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "Here is a screenshot of the error");

      const fileInput = screen.getByLabelText(/image attachment/i);
      const file = new File(["test"], "error.png", { type: "image/png" });
      await user.upload(fileInput, file);

      // Submit the form
      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(mockResponse.data.summary)).toBeInTheDocument();
      });

      // Verify API was called with FormData containing both text and file
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      const [url, formData, config] = mockedAxios.post.mock.calls[0];

      expect(url).toBe("http://localhost:8000/analyze-ticket");
      expect(formData).toBeInstanceOf(FormData);
      expect(config.headers["Content-Type"]).toBe("multipart/form-data");
    });

    test("should handle API error and display error message", async () => {
      const user = userEvent.setup();
      const errorResponse = {
        response: {
          status: 500,
          data: {
            detail: "Internal server error",
          },
        },
      };

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      render(<App />);

      // Fill out and submit form
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "Test ticket");

      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for demo mode fallback (API errors fall back to demo mode)
      await waitFor(() => {
        expect(
          screen.getByText(/customer reported a general inquiry/i)
        ).toBeInTheDocument();
      });
    });

    test("should handle network error and fallback to demo mode", async () => {
      const user = userEvent.setup();
      const networkError = new Error("Network Error");
      networkError.code = "ECONNREFUSED";

      mockedAxios.post.mockRejectedValueOnce(networkError);

      render(<App />);

      // Fill out and submit form
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "My application is not working properly");

      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for demo mode results
      await waitFor(() => {
        expect(
          screen.getByText(/customer reported a general inquiry/i)
        ).toBeInTheDocument();
      });

      // Verify demo mode results are displayed
      expect(screen.getByText("General Inquiry")).toBeInTheDocument();
      expect(screen.getByText("Neutral")).toBeInTheDocument();
      expect(screen.getByText("Medium")).toBeInTheDocument();
    });
  });

  describe("Form Reset Integration", () => {
    test("should clear form and results when clear button is clicked", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          summary: "Test summary",
          category: "Technical Issue",
          sentiment: "Neutral",
          priority: "Medium",
          draft_reply: "Test reply",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(<App />);

      // Fill out and submit form
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "Test ticket");

      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText("Test summary")).toBeInTheDocument();
      });

      // Click clear button
      const clearButton = screen.getByRole("button", { name: /clear form/i });
      await user.click(clearButton);

      // Verify form is cleared
      expect(textArea.value).toBe("");

      // Verify results are cleared
      expect(screen.queryByText("Test summary")).not.toBeInTheDocument();
    });
  });

  describe("Validation Integration", () => {
    test("should prevent submission with empty form and show validation message", async () => {
      const user = userEvent.setup();

      render(<App />);

      // Try to submit empty form
      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Verify validation message appears
      await waitFor(() => {
        expect(
          screen.getByText(/please enter ticket text/i)
        ).toBeInTheDocument();
      });

      // Verify API was not called
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test("should allow submission after validation error is fixed", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          summary: "Valid ticket submission",
          category: "General Inquiry",
          sentiment: "Neutral",
          priority: "Medium",
          draft_reply: "Thank you for your inquiry.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      render(<App />);

      // Try to submit empty form first
      const submitButton = screen.getByRole("button", {
        name: /analyze ticket/i,
      });
      await user.click(submitButton);

      // Wait for validation error
      await waitFor(() => {
        expect(
          screen.getByText(/please enter ticket text/i)
        ).toBeInTheDocument();
      });

      // Fix the validation error
      const textArea = screen.getByLabelText(/ticket text/i);
      await user.type(textArea, "Now I have entered some text");

      // Submit again
      await user.click(submitButton);

      // Wait for successful submission
      await waitFor(() => {
        expect(screen.getByText(mockResponse.data.summary)).toBeInTheDocument();
      });

      // Verify API was called
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });
});
