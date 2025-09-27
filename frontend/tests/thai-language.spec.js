const { test, expect } = require("@playwright/test");

test.describe("Thai Language Support", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/customer-support-on-twitter");
    await page.waitForLoadState("networkidle");
  });

  test("should detect Thai text and respond in Thai", async ({ page }) => {
    // Test with Thai text "ความเสียหาย" (damage/problem)
    const thaiText = "ความเสียหาย";

    // Fill the ticket text field
    await page.fill(
      'textarea[placeholder*="DESCRIBE YOUR ISSUE HERE"]',
      thaiText
    );

    // Click analyze button
    await page.click('button:has-text("ANALYZE TICKET")');

    // Wait for analysis to complete
    await page.waitForSelector(
      '[data-testid="analysis-result"], .bg-white.rounded-lg.shadow-md',
      { timeout: 10000 }
    );

    // Check if the response contains Thai text
    const summaryText = await page.textContent(
      '[data-testid="summary"], .text-gray-700'
    );
    const categoryText = await page.textContent('[data-testid="category"]');
    const sentimentText = await page.textContent('[data-testid="sentiment"]');
    const priorityText = await page.textContent('[data-testid="priority"]');
    const draftReplyText = await page.textContent(
      '[data-testid="draft-reply"]'
    );

    console.log("Summary:", summaryText);
    console.log("Category:", categoryText);
    console.log("Sentiment:", sentimentText);
    console.log("Priority:", priorityText);
    console.log("Draft Reply:", draftReplyText);

    // Verify Thai characters are present in responses
    const hasThaiInSummary = /[\u0E00-\u0E7F]/.test(summaryText || "");
    const hasThaiInCategory = /[\u0E00-\u0E7F]/.test(categoryText || "");
    const hasThaiInSentiment = /[\u0E00-\u0E7F]/.test(sentimentText || "");
    const hasThaiInPriority = /[\u0E00-\u0E7F]/.test(priorityText || "");
    const hasThaiInDraftReply = /[\u0E00-\u0E7F]/.test(draftReplyText || "");

    console.log("Thai detection results:");
    console.log("- Summary has Thai:", hasThaiInSummary);
    console.log("- Category has Thai:", hasThaiInCategory);
    console.log("- Sentiment has Thai:", hasThaiInSentiment);
    console.log("- Priority has Thai:", hasThaiInPriority);
    console.log("- Draft Reply has Thai:", hasThaiInDraftReply);

    // At least the draft reply should be in Thai
    expect(hasThaiInDraftReply).toBe(true);

    // Category should be in Thai
    expect(hasThaiInCategory).toBe(true);
  });

  test("should categorize Thai technical issue correctly", async ({ page }) => {
    // Test with Thai technical issue text
    const thaiTechText = "ระบบเสียใช้ไม่ได้";

    await page.fill(
      'textarea[placeholder*="DESCRIBE YOUR ISSUE HERE"]',
      thaiTechText
    );
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector(
      '[data-testid="analysis-result"], .bg-white.rounded-lg.shadow-md',
      { timeout: 10000 }
    );

    const categoryText = await page.textContent('[data-testid="category"]');
    console.log("Technical issue category:", categoryText);

    // Should be categorized as technical issue in Thai
    expect(categoryText).toContain("ปัญหาทางเทคนิค");
  });

  test("should handle Thai billing question", async ({ page }) => {
    // Test with Thai billing text
    const thaiBillingText = "เงินถูกหักซ้ำ";

    await page.fill(
      'textarea[placeholder*="DESCRIBE YOUR ISSUE HERE"]',
      thaiBillingText
    );
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector(
      '[data-testid="analysis-result"], .bg-white.rounded-lg.shadow-md',
      { timeout: 10000 }
    );

    const categoryText = await page.textContent('[data-testid="category"]');
    console.log("Billing question category:", categoryText);

    // Should be categorized as billing question in Thai
    expect(categoryText).toContain("คำถามเกี่ยวกับการเงิน");
  });

  test("should still work with English text", async ({ page }) => {
    // Test with English text to ensure we didn't break English support
    const englishText = "My account is broken";

    await page.fill(
      'textarea[placeholder*="DESCRIBE YOUR ISSUE HERE"]',
      englishText
    );
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector(
      '[data-testid="analysis-result"], .bg-white.rounded-lg.shadow-md',
      { timeout: 10000 }
    );

    const categoryText = await page.textContent('[data-testid="category"]');
    const draftReplyText = await page.textContent(
      '[data-testid="draft-reply"]'
    );

    console.log("English category:", categoryText);
    console.log("English draft reply:", draftReplyText);

    // Should be in English
    expect(categoryText).toContain("Account Problem");
    expect(draftReplyText).toContain("Thank you");
  });
});
