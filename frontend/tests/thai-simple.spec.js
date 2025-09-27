const { test, expect } = require('@playwright/test');

test.describe('Thai Language Support - Simple Test', () => {
  test('should respond in Thai when Thai text is entered', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    await page.waitForLoadState('networkidle');
    
    // Fill the ticket text field with Thai text
    const thaiText = 'ความเสียหาย';
    await page.fill('#ticket-text', thaiText);
    
    // Click analyze button
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for results to appear
    await page.waitForSelector('.space-y-6', { timeout: 15000 });
    
    // Get all text content from the page
    const pageContent = await page.textContent('body');
    console.log('Page content after analysis:', pageContent);
    
    // Check if Thai characters are present in the results
    const hasThaiInResults = /[\u0E00-\u0E7F]/.test(pageContent || '');
    console.log('Has Thai in results:', hasThaiInResults);
    
    // The results should contain Thai text
    expect(hasThaiInResults).toBe(true);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'thai-test-result.png', fullPage: true });
  });
  
  test('should still work with English text', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    await page.waitForLoadState('networkidle');
    
    // Fill the ticket text field with English text
    const englishText = 'My account is broken';
    await page.fill('#ticket-text', englishText);
    
    // Click analyze button
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for results to appear
    await page.waitForSelector('.space-y-6', { timeout: 15000 });
    
    // Get all text content from the page
    const pageContent = await page.textContent('body');
    console.log('English test page content:', pageContent);
    
    // Should contain English responses
    expect(pageContent).toContain('Account Problem');
    expect(pageContent).toContain('Thank you');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'english-test-result.png', fullPage: true });
  });
});
