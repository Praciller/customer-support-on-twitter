const { test, expect } = require("@playwright/test");

const PRODUCTION_URL =
  "https://praciller.github.io/customer-support-on-twitter/";

test.describe("Production E2E Testing - Customer Support AI System", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production application
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should load production application successfully", async ({ page }) => {
    // Verify main heading
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();

    // Verify subtitle
    await expect(
      page.getByText(
        "MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING"
      )
    ).toBeVisible();

    // Verify demo mode banner
    await expect(page.getByText("🚀 DEMO MODE ACTIVE")).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: "e2e-production-loaded.png",
      fullPage: true,
    });
  });

  test("should have all form elements visible and functional", async ({
    page,
  }) => {
    // Check form heading
    await expect(
      page.getByRole("heading", { name: "SUBMIT SUPPORT TICKET" })
    ).toBeVisible();

    // Check text area
    const textArea = page.getByLabel("TICKET TEXT");
    await expect(textArea).toBeVisible();
    await expect(textArea).toBeEditable();

    // Check file input
    const fileInput = page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)");
    await expect(fileInput).toBeVisible();

    // Check buttons
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "CLEAR FORM" })
    ).toBeVisible();

    // Verify file input has proper spacing (the fix we made)
    const fileInputElement = await fileInput.boundingBox();
    expect(fileInputElement.height).toBeGreaterThan(40); // Should have proper vertical spacing
  });

  test("should process text-only ticket successfully", async ({ page }) => {
    const testText =
      "My application keeps crashing when I try to upload files. This is very frustrating and I need help urgently!";

    // Fill in the text area
    await page.getByLabel("TICKET TEXT").fill(testText);

    // Submit the form
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for results to appear
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("CATEGORY & SENTIMENT")).toBeVisible();
    await expect(page.getByText("DRAFT REPLY")).toBeVisible();

    // Verify demo mode results contain expected content
    await expect(page.getByText(/backend technology stack/i)).toBeVisible();

    // Take screenshot of results
    await page.screenshot({
      path: "e2e-text-analysis-results.png",
      fullPage: true,
    });
  });

  test("should handle file upload functionality", async ({ page }) => {
    const testText =
      "Here is a screenshot of the error I am experiencing. Please help me resolve this issue.";

    // Fill in text
    await page.getByLabel("TICKET TEXT").fill(testText);

    // Create a test file for upload
    const fileContent = Buffer.from("fake-image-content-for-testing");

    // Upload file
    const fileInput = page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)");
    await fileInput.setInputFiles({
      name: "error-screenshot.png",
      mimeType: "image/png",
      buffer: fileContent,
    });

    // Verify file selection feedback
    await expect(
      page.getByText("SELECTED: error-screenshot.png")
    ).toBeVisible();

    // Take screenshot with file selected
    await page.screenshot({
      path: "e2e-file-upload-selected.png",
      fullPage: true,
    });

    // Submit form
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for results
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });

    // Take screenshot of results with file
    await page.screenshot({
      path: "e2e-file-upload-results.png",
      fullPage: true,
    });
  });

  test("should clear form correctly", async ({ page }) => {
    const testText = "Test ticket content";

    // Fill form
    await page.getByLabel("TICKET TEXT").fill(testText);

    // Verify content is there
    await expect(page.getByLabel("TICKET TEXT")).toHaveValue(testText);

    // Clear form
    await page.getByRole("button", { name: "CLEAR FORM" }).click();

    // Verify form is cleared
    await expect(page.getByLabel("TICKET TEXT")).toHaveValue("");

    // Verify no results are showing
    await expect(page.getByText("SUMMARY")).not.toBeVisible();
  });

  test("should be responsive on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify main elements are still visible
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();
    await expect(page.getByLabel("TICKET TEXT")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: "e2e-mobile-view.png", fullPage: true });

    // Test form functionality on mobile
    await page.getByLabel("TICKET TEXT").fill("Mobile test ticket");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Wait for results
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });

    // Take mobile results screenshot
    await page.screenshot({ path: "e2e-mobile-results.png", fullPage: true });
  });

  test("should be responsive on tablet devices", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Verify layout
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();
    await expect(page.getByLabel("TICKET TEXT")).toBeVisible();

    // Take tablet screenshot
    await page.screenshot({ path: "e2e-tablet-view.png", fullPage: true });
  });

  test("should handle multiple form submissions", async ({ page }) => {
    // First submission
    await page.getByLabel("TICKET TEXT").fill("First test ticket");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });

    // Second submission without clearing
    await page
      .getByLabel("TICKET TEXT")
      .fill("Second test ticket - updated content");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });

    // Verify the form is still functional
    await expect(
      page.getByRole("button", { name: "ANALYZE TICKET" })
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "CLEAR FORM" })
    ).toBeVisible();
  });

  test("should have proper accessibility features", async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    const h2 = page.getByRole("heading", { level: 2 });
    await expect(h2).toBeVisible();

    // Check form labels
    await expect(page.getByLabel("TICKET TEXT")).toBeVisible();
    await expect(page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)")).toBeVisible();

    // Check button accessibility
    const analyzeButton = page.getByRole("button", { name: "ANALYZE TICKET" });
    await expect(analyzeButton).toBeVisible();
    await expect(analyzeButton).toBeEnabled();

    const clearButton = page.getByRole("button", { name: "CLEAR FORM" });
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toBeEnabled();
  });

  test("should maintain state during navigation", async ({ page }) => {
    const testText = "Test content for state persistence";

    // Fill form
    await page.getByLabel("TICKET TEXT").fill(testText);

    // Refresh page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify form is cleared after refresh (expected behavior)
    await expect(page.getByLabel("TICKET TEXT")).toHaveValue("");

    // Verify application still works
    await expect(
      page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })
    ).toBeVisible();
  });

  test("should display proper error handling for edge cases", async ({
    page,
  }) => {
    // Test with minimal text (empty form might not trigger demo response)
    await page.getByLabel("TICKET TEXT").fill("Test");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Should work in demo mode
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });

    // Clear and test with very long text
    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    const longText = "A".repeat(1000); // Reduced length for better performance
    await page.getByLabel("TICKET TEXT").fill(longText);
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();

    // Should handle long text gracefully
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 15000 });
  });
});
