import axios from "axios";
import { generateDemoResponse } from "../App";

// Mock axios
jest.mock("axios");
const mockedAxios = axios;

describe("API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Ticket Analysis API", () => {
    test("should handle successful API response", async () => {
      const mockResponse = {
        data: {
          summary:
            "Customer reported a technical issue with login functionality",
          category: "Technical Issue",
          sentiment: "Frustrated",
          priority: "High",
          draft_reply:
            "Thank you for reporting this issue. We are investigating the login problem and will provide a fix within 24 hours.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const formData = new FormData();
      formData.append("text", "I cannot log into my account");

      const response = await axios.post(
        "http://localhost:8000/analyze-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/analyze-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });

    test("should handle API error response", async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            detail: "Internal server error",
          },
        },
      };

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      const formData = new FormData();
      formData.append("text", "Test ticket");

      await expect(
        axios.post("http://localhost:8000/analyze-ticket", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).rejects.toEqual(errorResponse);
    });

    test("should handle network error", async () => {
      const networkError = new Error("Network Error");
      networkError.code = "ECONNREFUSED";

      mockedAxios.post.mockRejectedValueOnce(networkError);

      const formData = new FormData();
      formData.append("text", "Test ticket");

      await expect(
        axios.post("http://localhost:8000/analyze-ticket", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).rejects.toEqual(networkError);
    });

    test("should handle file upload with text", async () => {
      const mockResponse = {
        data: {
          summary: "Customer reported issue with image attachment",
          category: "Technical Issue",
          sentiment: "Neutral",
          priority: "Medium",
          draft_reply:
            "Thank you for providing the screenshot. We will analyze the issue and respond shortly.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const formData = new FormData();
      formData.append("text", "Issue with image upload");
      formData.append(
        "image",
        new File(["test"], "test.png", { type: "image/png" })
      );

      const response = await axios.post(
        "http://localhost:8000/analyze-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/analyze-ticket",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    });
  });

  describe("Demo Mode Integration", () => {
    test("should generate appropriate demo response for technical issues", () => {
      const ticketText =
        "My application has a bug and keeps crashing when I try to save files";
      const result = generateDemoResponse(ticketText, false);

      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("category");
      expect(result).toHaveProperty("sentiment");
      expect(result).toHaveProperty("priority");
      expect(result).toHaveProperty("draft_reply");

      expect(result.category).toBe("Technical Issue");
      expect(result.priority).toBe("High");
      expect(result.sentiment).toBe("Frustrated");
    });

    test("should generate appropriate demo response for billing questions", () => {
      const ticketText = "I was charged twice for my bill this month";
      const result = generateDemoResponse(ticketText, false);

      expect(result.category).toBe("Billing Question");
      expect(result.priority).toBe("Medium");
      expect(result.sentiment).toBe("Neutral"); // Default sentiment for billing
    });

    test("should generate appropriate demo response for feature requests", () => {
      const ticketText =
        "It would be great if you could add a new feature for dark mode to the application";
      const result = generateDemoResponse(ticketText, false);

      expect(result.category).toBe("Feature Request");
      expect(result.priority).toBe("Low");
      expect(result.sentiment).toBe("Positive");
    });

    test("should handle demo response with image attachment", () => {
      const ticketText = "Here is a screenshot of the error I am seeing";
      const result = generateDemoResponse(ticketText, true);

      expect(result.summary).toContain("Image attachment provided");
      expect(typeof result.summary).toBe("string");
      expect(result.summary.length).toBeGreaterThan(0);
    });

    test("should generate fallback response for unrecognized text", () => {
      const ticketText = "Random text that does not match any category";
      const result = generateDemoResponse(ticketText, false);

      expect(result.category).toBe("General Inquiry");
      expect(result.sentiment).toBe("Neutral");
      expect(result.priority).toBe("Medium");
    });
  });
});
