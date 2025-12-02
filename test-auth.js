// Test script for authentication endpoint
// Usage: node test-auth.js <your-domain> <password>
// Example: node test-auth.js agile-kakizome.pages.dev mypassword

const args = process.argv.slice(2);
const domain = args[0] || 'localhost:8788';
const password = args[1] || 'test';

console.log(`Testing auth at: https://${domain}/api/auth`);
console.log(`Using password: ${password}`);
console.log('---');

fetch(`https://${domain}/api/auth`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ password }),
})
  .then(async (response) => {
    console.log(`Status: ${response.status} ${response.statusText}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data);

      if (response.status === 401) {
        console.log('\n⚠️  401 Unauthorized - Password is incorrect');
        console.log('Solutions:');
        console.log('1. Check that ACCESS_PASSWORD is set in Cloudflare Pages dashboard');
        console.log('2. Verify the password you\'re using matches ACCESS_PASSWORD');
        console.log('3. Redeploy after setting environment variables');
      }
    } else {
      console.log('\n✅ Authentication successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  })
  .catch((error) => {
    console.error('Network error:', error.message);
  });
