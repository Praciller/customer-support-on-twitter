const { test, expect } = require('@playwright/test');

test.describe('Manual Thai Test', () => {
  test('manual test with detailed debugging', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'manual-test-1-initial.png', fullPage: true });
    
    // Check if the form is visible
    const formVisible = await page.isVisible('#ticket-text');
    console.log('Form visible:', formVisible);
    
    if (!formVisible) {
      console.log('Form not visible, waiting longer...');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'manual-test-2-after-wait.png', fullPage: true });
    }
    
    // Fill the form with Thai text
    const thaiText = 'ความเสียหาย';
    console.log('Filling form with:', thaiText);
    await page.fill('#ticket-text', thaiText);
    
    // Take screenshot after filling
    await page.screenshot({ path: 'manual-test-3-filled.png', fullPage: true });
    
    // Click the analyze button
    console.log('Clicking analyze button...');
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Take screenshot after clicking
    await page.screenshot({ path: 'manual-test-4-clicked.png', fullPage: true });
    
    // Wait for the loading state to change
    console.log('Waiting for analysis...');
    await page.waitForTimeout(3000); // Wait 3 seconds for demo delay
    
    // Take screenshot during analysis
    await page.screenshot({ path: 'manual-test-5-analyzing.png', fullPage: true });
    
    // Wait a bit more for results
    await page.waitForTimeout(2000);
    
    // Take final screenshot
    await page.screenshot({ path: 'manual-test-6-final.png', fullPage: true });
    
    // Get the full page content
    const pageContent = await page.textContent('body');
    console.log('Final page content:', pageContent);
    
    // Check if Thai characters are present
    const hasThaiInResults = /[\u0E00-\u0E7F]/.test(pageContent || '');
    console.log('Has Thai in results:', hasThaiInResults);
    
    // Check if we have results section
    const hasResults = await page.isVisible('.space-y-6');
    console.log('Results section visible:', hasResults);
    
    if (hasResults) {
      const resultsText = await page.textContent('.space-y-6');
      console.log('Results text:', resultsText);
    }
  });
});
