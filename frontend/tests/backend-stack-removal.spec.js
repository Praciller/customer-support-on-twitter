const { test, expect } = require('@playwright/test');

test.describe('Backend Stack Section Removal', () => {
  test('should not show BACKEND TECHNOLOGY STACK section after analysis', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    await page.waitForLoadState('networkidle');
    
    // Fill the form with test text
    const testText = 'My account is broken';
    await page.fill('#ticket-text', testText);
    
    // Click analyze button
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for results to appear
    await page.waitForSelector('.space-y-6', { timeout: 15000 });
    
    // Get all text content from the page
    const pageContent = await page.textContent('body');
    console.log('Checking for BACKEND TECHNOLOGY STACK...');
    
    // The page should NOT contain "BACKEND TECHNOLOGY STACK"
    const hasBackendStack = pageContent.includes('BACKEND TECHNOLOGY STACK');
    console.log('Has BACKEND TECHNOLOGY STACK:', hasBackendStack);
    
    // Should not contain the backend stack section
    expect(hasBackendStack).toBe(false);
    
    // Should still contain the analysis results
    expect(pageContent).toContain('SUMMARY');
    expect(pageContent).toContain('CATEGORY');
    expect(pageContent).toContain('DRAFT REPLY');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'backend-stack-removed.png', fullPage: true });
  });
  
  test('should show updated demo mode message about image processing', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    await page.waitForLoadState('networkidle');
    
    // Get the demo mode message
    const pageContent = await page.textContent('body');
    
    // Should contain the updated message about vision capabilities
    expect(pageContent).toContain('Google Gemini AI with vision capabilities');
    expect(pageContent).toContain('Image uploads are acknowledged but not processed in demo mode');
    
    console.log('Demo mode message updated correctly');
  });
});
