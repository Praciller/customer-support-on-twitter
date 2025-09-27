const { test, expect } = require("@playwright/test");

test.describe("Customer Support AI System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/customer-support-on-twitter");
  });

  test("should display the main header and application elements", async ({
    page,
  }) => {
    // Check main header
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING"
      )
    ).toBeVisible();

    // Check demo mode banner (may or may not be visible depending on environment)
    const demoBanner = page.getByText("🚀 DEMO MODE ACTIVE");
    // Don't assert presence since it depends on environment

    // Ensure the page is fully loaded by checking for form elements
    await expect(page.getByLabel("TICKET TEXT *")).toBeVisible();
  });

  test("should have a functional form with required fields", async ({
    page,
  }) => {
    // Check form elements exist
    await expect(page.getByLabel("TICKET TEXT *")).toBeVisible();
    await expect(page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "CLEAR FORM" })
    ).toBeVisible();
  });

  test("should require ticket text before submission", async ({ page }) => {
    // Try to submit without text
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Should not proceed (form validation should prevent submission)
    await expect(page.getByLabel("TICKET TEXT *")).toBeFocused();
  });

  test("should submit form and show analysis results", async ({ page }) => {
    // Fill in the ticket text
    await page
      .getByLabel("TICKET TEXT *")
      .fill(
        "My application is not working properly. I keep getting error messages."
      );

    // Submit the form
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for analysis to complete (demo mode should be fast)
    await expect(
      page.getByRole("button", { name: "ANALYZING..." })
    ).toBeVisible();

    // Check that results appear
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("CATEGORY & SENTIMENT")).toBeVisible();
    await expect(page.getByText("DRAFT REPLY")).toBeVisible();
    await expect(page.getByText("BACKEND TECHNOLOGY STACK")).toBeVisible();
  });

  test("should clear form when clear button is clicked", async ({ page }) => {
    // Fill in some text
    await page.getByLabel("TICKET TEXT *").fill("Test ticket text");

    // Click clear button
    await page.getByRole("button", { name: "CLEAR FORM" }).click();

    // Check that form is cleared
    await expect(page.getByLabel("TICKET TEXT *")).toHaveValue("");
  });

  test("should handle file upload", async ({ page }) => {
    // Create a test file (we'll use a simple text file as image for testing)
    const fileContent = "test image content";
    const fileName = "test-image.png";

    // Upload file
    const fileInput = page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)");
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: "image/png",
      buffer: Buffer.from(fileContent),
    });

    // Check that file is selected
    await expect(page.getByText(`SELECTED: ${fileName}`)).toBeVisible();
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that main elements are still visible and accessible
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();
    await expect(page.getByLabel("TICKET TEXT *")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeVisible();
  });

  test("should display backend technology information", async ({ page }) => {
    // Fill and submit form to see results
    await page.getByLabel("TICKET TEXT *").fill("Test ticket for backend info");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for results and check backend info
    await expect(page.getByText("BACKEND TECHNOLOGY STACK")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("AI & PROCESSING:")).toBeVisible();
    await expect(page.getByText("INFRASTRUCTURE:")).toBeVisible();
    await expect(
      page.getByText("Google Gemini AI for text analysis")
    ).toBeVisible();
    await expect(page.getByText("FastAPI Python backend")).toBeVisible();
  });

  test("should handle different ticket categories correctly", async ({
    page,
  }) => {
    // Test technical issue
    await page
      .getByLabel("TICKET TEXT *")
      .fill("My application has a bug and keeps crashing");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Technical Issue").first()).toBeVisible();
    await expect(page.getByText("High").first()).toBeVisible();

    // Clear and test billing question
    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    await page
      .getByLabel("TICKET TEXT *")
      .fill("I was charged twice for my bill this month");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Billing Question").first()).toBeVisible();

    // Clear and test feature request
    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    await page
      .getByLabel("TICKET TEXT *")
      .fill("Please add a new feature for dark mode");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Feature Request").first()).toBeVisible();
  });

  test("should handle form submission with both text and image", async ({
    page,
  }) => {
    // Fill in text
    await page
      .getByLabel("TICKET TEXT *")
      .fill("Here is a screenshot of the error I am seeing");

    // Upload image
    const fileInput = page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)");
    await fileInput.setInputFiles({
      name: "error-screenshot.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });

    // Verify file is selected
    await expect(
      page.getByText("SELECTED: error-screenshot.png")
    ).toBeVisible();

    // Submit form
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for results
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });

    // Results should mention image attachment
    await expect(page.getByText(/image attachment provided/i)).toBeVisible();
  });

  test("should maintain form state during analysis", async ({ page }) => {
    // Fill in form
    await page.getByLabel("TICKET TEXT *").fill("Test ticket text");

    // Submit form
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // During analysis, form should be disabled
    await expect(
      page.getByRole("button", { name: "ANALYZING..." })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ANALYZING..." })
    ).toBeDisabled();

    // Wait for completion
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });

    // Form should be enabled again
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeEnabled();

    // Original text should still be there
    await expect(page.getByLabel("TICKET TEXT *")).toHaveValue(
      "Test ticket text"
    );
  });

  test("should display all result sections after analysis", async ({
    page,
  }) => {
    // Submit a comprehensive test
    await page
      .getByLabel("TICKET TEXT *")
      .fill("I need help with my account login issues");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for all result sections to appear
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("CATEGORY & SENTIMENT")).toBeVisible();
    await expect(page.getByText("DRAFT REPLY")).toBeVisible();
    await expect(page.getByText("BACKEND TECHNOLOGY STACK")).toBeVisible();

    // Check that each section has content
    await expect(
      page
        .locator("text=CATEGORY:")
        .locator("..")
        .getByText(/Account Problem|Technical Issue|General Inquiry/)
    ).toBeVisible();
    await expect(
      page
        .locator("text=SENTIMENT:")
        .locator("..")
        .getByText(/Frustrated|Neutral|Positive/)
    ).toBeVisible();
    await expect(
      page
        .locator("text=PRIORITY:")
        .locator("..")
        .getByText(/High|Medium|Low/)
    ).toBeVisible();
  });

  test("should work correctly after multiple form submissions", async ({
    page,
  }) => {
    // First submission
    await page.getByLabel("TICKET TEXT *").fill("First test ticket");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });

    // Clear and second submission
    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    await page.getByLabel("TICKET TEXT *").fill("Second test ticket");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });

    // Third submission without clearing
    await page.getByLabel("TICKET TEXT *").fill("Third test ticket");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });

    // Verify the form is still functional
    await expect(page.getByLabel("TICKET TEXT *")).toHaveValue(
      "Third test ticket"
    );
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeEnabled();
  });
});
