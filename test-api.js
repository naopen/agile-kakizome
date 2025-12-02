// Test script for Agile Kakizome API
// Usage: node test-api.js <your-domain> <password>
// Example: node test-api.js agile-kakizome.pages.dev mypassword

const args = process.argv.slice(2);
const domain = args[0] || 'localhost:8788';
const password = args[1] || 'test';

const testPayload = {
  review: '2025年はアジャイル開発の原則を深く学び、チームの生産性が向上しました。',
  goal: 'さらにチーム全体のコラボレーションを強化し、新しい挑戦に取り組みたいです。',
  password: password
};

console.log(`Testing API at: https://${domain}/api/generate`);
console.log(`Using password: ${password}`);
console.log('---');

fetch(`https://${domain}/api/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testPayload),
})
  .then(async (response) => {
    console.log(`Status: ${response.status} ${response.statusText}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data);

      if (response.status === 401) {
        console.log('\n⚠️  401 Unauthorized - Password is incorrect or ACCESS_PASSWORD env var is not set');
        console.log('Solutions:');
        console.log('1. Check that ACCESS_PASSWORD is set in Cloudflare Pages dashboard');
        console.log('2. Verify the password you\'re using matches ACCESS_PASSWORD');
        console.log('3. Redeploy after setting environment variables');
      } else if (response.status === 500 && data.error === 'Server configuration error') {
        console.log('\n⚠️  500 Server Configuration Error - Environment variables not set');
        console.log('Solutions:');
        console.log('1. Set GEMINI_API_KEY in Cloudflare Pages dashboard');
        console.log('2. Set ACCESS_PASSWORD in Cloudflare Pages dashboard');
        console.log('3. Redeploy after setting environment variables');
      }
    } else {
      console.log('\n✅ Success!');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  })
  .catch((error) => {
    console.error('Network error:', error.message);
  });
