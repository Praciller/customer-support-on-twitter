const { test, expect } = require("@playwright/test");

test.describe("Customer Support AI System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/customer-support-on-twitter");
  });

  test("renders the ticket workflow", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "CUSTOMER SUPPORT AI SYSTEM" })).toBeVisible();
    await expect(page.getByText("MULTIMODAL TICKET ANALYSIS WITH TEXT AND IMAGE PROCESSING")).toBeVisible();
    await expect(page.getByLabel("TICKET TEXT *")).toBeVisible();
    await expect(page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)")).toBeVisible();
    await expect(page.getByRole("button", { name: "ANALYZE TICKET" })).toBeVisible();
    await expect(page.getByRole("button", { name: "CLEAR FORM" })).toBeVisible();
  });

  test("classifies a technical issue deterministically", async ({ page }) => {
    await page.getByLabel("TICKET TEXT *").fill("My application has a bug and keeps crashing");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("SUMMARY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Technical Issue").first()).toBeVisible();
    await expect(page.getByText("High").first()).toBeVisible();
    await expect(page.getByText("BACKEND TECHNOLOGY STACK")).toBeVisible();
    await expect(page.getByText("Deterministic local ticket triage")).toBeVisible();
    await expect(page.getByText("FastAPI Python backend")).toBeVisible();
  });

  test("handles billing and feature categories", async ({ page }) => {
    await page.getByLabel("TICKET TEXT *").fill("I was charged twice for my bill this month");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("Billing Question").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    await page.getByLabel("TICKET TEXT *").fill("Please add a new feature for dark mode");
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText("Feature Request").first()).toBeVisible({ timeout: 10000 });
  });

  test("acknowledges an image attachment without claiming image interpretation", async ({ page }) => {
    await page.getByLabel("TICKET TEXT *").fill("Here is a screenshot of the error I am seeing");
    await page.getByLabel("IMAGE ATTACHMENT (OPTIONAL)").setInputFiles({
      name: "error-screenshot.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-data"),
    });
    await expect(page.getByText("SELECTED: error-screenshot.png")).toBeVisible();
    await page.getByRole("button", { name: "ANALYZE TICKET" }).click();
    await expect(page.getByText(/image attachment provided/i)).toBeVisible({ timeout: 10000 });
  });

  test("clears form state", async ({ page }) => {
    await page.getByLabel("TICKET TEXT *").fill("Test ticket text");
    await page.getByRole("button", { name: "CLEAR FORM" }).click();
    await expect(page.getByLabel("TICKET TEXT *")).toHaveValue("");
  });
});
