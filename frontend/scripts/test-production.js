const { chromium } = require('playwright');

async function testProductionApp() {
  console.log('🚀 Testing Production Application...');
  console.log('URL: https://praciller.github.io/customer-support-on-twitter/');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the production application
    console.log('📍 Navigating to production app...');
    await page.goto('https://praciller.github.io/customer-support-on-twitter/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify main elements are visible
    console.log('✅ Checking main header...');
    await page.waitForSelector('h1:has-text("CUSTOMER SUPPORT AI SYSTEM")', { timeout: 10000 });
    
    // Check for demo mode banner
    console.log('✅ Checking demo mode banner...');
    const demoBanner = await page.getByText('🚀 DEMO MODE ACTIVE');
    if (await demoBanner.isVisible()) {
      console.log('✅ Demo mode is active (expected for GitHub Pages)');
    }
    
    // Verify form elements
    console.log('✅ Checking form elements...');
    await page.waitForSelector('label:has-text("TICKET TEXT")', { timeout: 5000 });
    await page.waitForSelector('label:has-text("IMAGE ATTACHMENT")', { timeout: 5000 });
    await page.waitForSelector('button:has-text("ANALYZE TICKET")', { timeout: 5000 });
    await page.waitForSelector('button:has-text("CLEAR FORM")', { timeout: 5000 });
    
    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: 'production-test-initial.png', fullPage: true });
    
    // Test 1: Text-only ticket analysis
    console.log('🧪 Test 1: Text-only ticket analysis...');
    await page.fill('textarea[id="ticket-text"]', 'My application keeps crashing when I try to upload files. This is very frustrating and I need help urgently!');
    
    // Take screenshot with text filled
    console.log('📸 Screenshot: Text filled...');
    await page.screenshot({ path: 'production-test-text-filled.png', fullPage: true });
    
    // Submit the form
    console.log('📤 Submitting text-only form...');
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for analysis to complete
    console.log('⏳ Waiting for analysis results...');
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    await page.waitForSelector('text=CATEGORY & SENTIMENT', { timeout: 5000 });
    await page.waitForSelector('text=DRAFT REPLY', { timeout: 5000 });
    
    // Verify results content
    console.log('✅ Verifying analysis results...');
    const summaryVisible = await page.getByText('SUMMARY').isVisible();
    const categoryVisible = await page.getByText('CATEGORY & SENTIMENT').isVisible();
    const replyVisible = await page.getByText('DRAFT REPLY').isVisible();
    
    if (summaryVisible && categoryVisible && replyVisible) {
      console.log('✅ All result sections are visible');
    } else {
      console.log('❌ Some result sections are missing');
    }
    
    // Take screenshot of results
    console.log('📸 Screenshot: Analysis results...');
    await page.screenshot({ path: 'production-test-results.png', fullPage: true });
    
    // Test 2: File upload functionality
    console.log('🧪 Test 2: File upload functionality...');
    await page.click('button:has-text("CLEAR FORM")');
    
    // Fill text for file upload test
    await page.fill('textarea[id="ticket-text"]', 'Here is a screenshot of the error I am experiencing. Please help me resolve this issue.');
    
    // Test file upload
    console.log('📁 Testing file upload...');
    const fileInput = page.locator('input[type="file"]');
    
    // Create a test file for upload
    const testFileContent = Buffer.from('fake-image-content-for-testing');
    await fileInput.setInputFiles({
      name: 'error-screenshot.png',
      mimeType: 'image/png',
      buffer: testFileContent
    });
    
    // Verify file is selected
    console.log('✅ Verifying file selection...');
    await page.waitForSelector('text=SELECTED:', { timeout: 5000 });
    const fileSelectedText = await page.getByText('SELECTED: error-screenshot.png');
    if (await fileSelectedText.isVisible()) {
      console.log('✅ File selection confirmed');
    } else {
      console.log('❌ File selection not working');
    }
    
    // Take screenshot with file upload
    console.log('📸 Screenshot: File uploaded...');
    await page.screenshot({ path: 'production-test-file-upload.png', fullPage: true });
    
    // Submit form with file
    console.log('📤 Submitting form with file...');
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for results
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    
    // Take final screenshot
    console.log('📸 Screenshot: Final results with file...');
    await page.screenshot({ path: 'production-test-final.png', fullPage: true });
    
    // Test 3: Responsive design
    console.log('🧪 Test 3: Responsive design...');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'production-test-mobile.png', fullPage: true });
    console.log('📱 Mobile view tested');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'production-test-tablet.png', fullPage: true });
    console.log('📱 Tablet view tested');
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Test 4: Multiple form submissions
    console.log('🧪 Test 4: Multiple form submissions...');
    await page.click('button:has-text("CLEAR FORM")');
    
    // First submission
    await page.fill('textarea[id="ticket-text"]', 'First test ticket');
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    
    // Second submission without clearing
    await page.fill('textarea[id="ticket-text"]', 'Second test ticket - updated content');
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    
    console.log('✅ Multiple submissions working');
    
    // Final verification
    console.log('🔍 Final verification...');
    const analyzeButton = await page.getByRole('button', { name: 'ANALYZE TICKET' });
    const clearButton = await page.getByRole('button', { name: 'CLEAR FORM' });
    
    if (await analyzeButton.isEnabled() && await clearButton.isVisible()) {
      console.log('✅ Form controls are functional');
    }
    
    console.log('🎉 Production testing completed successfully!');
    console.log('📸 Screenshots saved:');
    console.log('  - production-test-initial.png');
    console.log('  - production-test-text-filled.png');
    console.log('  - production-test-results.png');
    console.log('  - production-test-file-upload.png');
    console.log('  - production-test-final.png');
    console.log('  - production-test-mobile.png');
    console.log('  - production-test-tablet.png');
    
    console.log('🔍 Browser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close when done.');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    await page.screenshot({ path: 'production-test-error.png', fullPage: true });
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Closing browser...');
  process.exit(0);
});

if (require.main === module) {
  testProductionApp().catch(console.error);
}

module.exports = { testProductionApp };
