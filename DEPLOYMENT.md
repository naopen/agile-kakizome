# Deployment Guide for Agile Kakizome

## Environment Variables Setup

### Cloudflare Pages Dashboard

After deploying to Cloudflare Pages, you **must** set the environment variables:

1. Navigate to your Cloudflare Pages project dashboard
2. Go to **Settings** → **Environment variables**
3. Add the following variables for **Production** environment:

#### GEMINI_API_KEY
- **Variable name:** `GEMINI_API_KEY`
- **Value:** Your Google Gemini API key
- Get your API key from: https://aistudio.google.com/apikey

#### ACCESS_PASSWORD
- **Variable name:** `ACCESS_PASSWORD`
- **Value:** Your desired password (e.g., `rsgt2026`)
- This is the password users will enter to access the demo

### Important Notes

1. **Both variables are required** - The app will return 500 error if they are not set
2. **Redeploy after setting variables** - After adding environment variables, trigger a new deployment for changes to take effect
3. **Case-sensitive** - Variable names must match exactly: `GEMINI_API_KEY` and `ACCESS_PASSWORD`

## Troubleshooting 401 Errors

If you're getting 401 Unauthorized errors:

### Check 1: Environment Variables Are Set
- Verify both `GEMINI_API_KEY` and `ACCESS_PASSWORD` are set in Cloudflare Pages dashboard
- Check for typos in variable names

### Check 2: Password Matches
- The password you enter in the app must exactly match the `ACCESS_PASSWORD` you set
- Passwords are case-sensitive

### Check 3: Redeploy
- After setting environment variables, you must redeploy:
  ```bash
  npm run deploy
  ```
  Or trigger a new deployment from the Cloudflare dashboard

### Check 4: Check Logs
- Go to Cloudflare Pages dashboard → Your project → Functions
- Check the function logs for errors
- Look for messages like:
  - "Environment variables not set" → Variables are missing
  - "Password validation failed" → Password doesn't match

## Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

3. **Set environment variables** in Cloudflare Pages dashboard (see above)

4. **Trigger a new deployment** (or wait for automatic redeployment)

5. **Test the application:**
   - Visit your Cloudflare Pages URL
   - Click "書き初めを始める"
   - Enter the password you set as `ACCESS_PASSWORD`
   - Fill in the form and submit

## Local Development

For local development, create a `.dev.vars` file:

```env
GEMINI_API_KEY=your_api_key_here
ACCESS_PASSWORD=your_password_here
```

Then run:
```bash
npm run dev
# In another terminal:
npm run pages:dev
```

Visit http://localhost:8788

## API Endpoints

The app provides two API endpoints:

### 1. Authentication Endpoint
- **Path:** `/api/auth`
- **Method:** POST
- **Purpose:** Validates password before allowing access to the form
- **Request:** `{ "password": "your_password" }`
- **Response:** `{ "success": true }` or `{ "success": false, "error": "Invalid password" }`

### 2. Generation Endpoint
- **Path:** `/api/generate`
- **Method:** POST
- **Purpose:** Generates kanji based on user input
- **Request:** `{ "review": "...", "goal": "...", "password": "..." }`
- **Response:** `{ "kanji": "協", "meaning_jp": "...", "meaning_en": "..." }`

## API Model Information

The app uses the latest Gemini 2.5 Flash model:
- Model: `gemini-2.5-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Authentication: Query parameter `key=YOUR_API_KEY`

## Testing

Test authentication:
```bash
node test-auth.js your-domain.pages.dev your_password
```

Test full generation:
```bash
node test-api.js your-domain.pages.dev your_password
```
