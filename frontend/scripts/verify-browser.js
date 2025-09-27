const { chromium } = require('playwright');

async function verifyBrowserRendering() {
  console.log('🚀 Starting browser verification...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application
    console.log('📍 Navigating to application...');
    await page.goto('http://localhost:3000/customer-support-on-twitter');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify main elements are visible
    console.log('✅ Checking main header...');
    await page.waitForSelector('h1:has-text("CUSTOMER SUPPORT AI SYSTEM")', { timeout: 10000 });
    
    console.log('✅ Checking form elements...');
    await page.waitForSelector('label:has-text("TICKET TEXT")', { timeout: 5000 });
    await page.waitForSelector('label:has-text("IMAGE ATTACHMENT")', { timeout: 5000 });
    await page.waitForSelector('button:has-text("ANALYZE TICKET")', { timeout: 5000 });
    await page.waitForSelector('button:has-text("CLEAR FORM")', { timeout: 5000 });
    
    // Take a screenshot of the initial state
    console.log('📸 Taking screenshot of initial state...');
    await page.screenshot({ path: 'verification-initial.png', fullPage: true });
    
    // Test form functionality
    console.log('🧪 Testing form functionality...');
    await page.fill('textarea[id="ticket-text"]', 'This is a test ticket to verify the shadcn/ui components are working correctly');
    
    // Take screenshot with filled form
    console.log('📸 Taking screenshot with filled form...');
    await page.screenshot({ path: 'verification-form-filled.png', fullPage: true });
    
    // Submit the form
    console.log('📤 Submitting form...');
    await page.click('button:has-text("ANALYZE TICKET")');
    
    // Wait for results
    console.log('⏳ Waiting for analysis results...');
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    await page.waitForSelector('text=CATEGORY & SENTIMENT', { timeout: 5000 });
    await page.waitForSelector('text=DRAFT REPLY', { timeout: 5000 });
    
    // Take screenshot of results
    console.log('📸 Taking screenshot of results...');
    await page.screenshot({ path: 'verification-results.png', fullPage: true });
    
    // Test file upload
    console.log('📁 Testing file upload...');
    await page.click('button:has-text("CLEAR FORM")');
    await page.fill('textarea[id="ticket-text"]', 'Here is a screenshot of an error');
    
    // Create a test file for upload
    const fileContent = Buffer.from('fake-image-content');
    await page.setInputFiles('input[type="file"]', {
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: fileContent
    });
    
    // Verify file is selected
    await page.waitForSelector('text=SELECTED:', { timeout: 5000 });
    
    // Take screenshot with file upload
    console.log('📸 Taking screenshot with file upload...');
    await page.screenshot({ path: 'verification-file-upload.png', fullPage: true });
    
    // Submit with file
    await page.click('button:has-text("ANALYZE TICKET")');
    await page.waitForSelector('text=SUMMARY', { timeout: 15000 });
    
    // Take final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: 'verification-final.png', fullPage: true });
    
    // Test responsive design
    console.log('📱 Testing responsive design...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'verification-mobile.png', fullPage: true });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'verification-tablet.png', fullPage: true });
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('✅ All verifications completed successfully!');
    console.log('📸 Screenshots saved:');
    console.log('  - verification-initial.png');
    console.log('  - verification-form-filled.png');
    console.log('  - verification-results.png');
    console.log('  - verification-file-upload.png');
    console.log('  - verification-final.png');
    console.log('  - verification-mobile.png');
    console.log('  - verification-tablet.png');
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser will remain open for manual inspection...');
    console.log('Press Ctrl+C to close when done.');
    
    // Wait for user to close manually
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    await page.screenshot({ path: 'verification-error.png', fullPage: true });
    throw error;
  } finally {
    // Don't close automatically to allow manual inspection
    // await browser.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Closing browser...');
  process.exit(0);
});

if (require.main === module) {
  verifyBrowserRendering().catch(console.error);
}

module.exports = { verifyBrowserRendering };
