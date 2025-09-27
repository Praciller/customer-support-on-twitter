// Test the generateDemoResponse function directly
const { generateDemoResponse } = require('./src/App.js');

console.log('Testing Thai text: ความเสียหาย');
const thaiResult = generateDemoResponse('ความเสียหาย', false);
console.log('Thai result:', JSON.stringify(thaiResult, null, 2));

console.log('\nTesting English text: My account is broken');
const englishResult = generateDemoResponse('My account is broken', false);
console.log('English result:', JSON.stringify(englishResult, null, 2));

console.log('\nTesting Thai technical issue: ระบบเสียใช้ไม่ได้');
const thaiTechResult = generateDemoResponse('ระบบเสียใช้ไม่ได้', false);
console.log('Thai tech result:', JSON.stringify(thaiTechResult, null, 2));
