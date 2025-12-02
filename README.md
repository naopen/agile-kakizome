# Agile Kakizome 2026

AI-powered Kakizome (New Year's Resolution) for RSGT2026 LT Demo

## Overview

"Agile Kakizome" is an artistic web application that generates a meaningful kanji character for the new year based on your reflections from 2025 and goals for 2026. The application uses Google Gemini 2.0 Flash to analyze your input and present the kanji in traditional brush calligraphy style.

## Design Philosophy: "Digital Wabi-Sabi"

- **Color Palette:**
  - Background: `#fcfaf2` (Washi paper-like off-white)
  - Text/Primary: `#1c1c1c` (Ink black - Sumi)
  - Accent: `#da4a38` (Seal red - Shuniku)

- **Typography:**
  - Yuji Syuku (Serif) - For headings and kanji
  - Zen Kaku Gothic New (Sans) - For UI text

## Tech Stack

- **Platform:** Cloudflare Pages
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI base)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Cloudflare Pages Functions
- **AI Model:** Google Gemini 2.0 Flash

## Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Cloudflare account
- Google Gemini API key

### Local Development

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment variables file:**

```bash
cp .dev.vars.example .dev.vars
```

3. **Edit `.dev.vars` and add your credentials:**

```env
GEMINI_API_KEY=your_gemini_api_key_here
ACCESS_PASSWORD=your_password_here
```

4. **Run the development server:**

```bash
npm run dev
```

5. **In another terminal, run Cloudflare Pages Functions locally:**

```bash
npm run pages:dev
```

Visit `http://localhost:8788` in your browser.

## Deployment

### Deploy to Cloudflare Pages

1. **Build the project:**

```bash
npm run build
```

2. **Deploy using Wrangler:**

```bash
npm run deploy
```

3. **⚠️ IMPORTANT: Set environment variables in Cloudflare Pages dashboard:**

- Navigate to your project in Cloudflare Pages dashboard
- Go to Settings → Environment variables
- Add these variables for **Production** environment:
  - `GEMINI_API_KEY`: Your Google Gemini API key (get from https://aistudio.google.com/apikey)
  - `ACCESS_PASSWORD`: Your access password for the demo

4. **Redeploy after setting variables** to apply changes

**For detailed deployment instructions and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Project Structure

```
/
├── functions/
│   └── api/
│       └── generate.ts          # Backend API with Gemini integration
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Hero.tsx             # Landing page with animations
│   │   ├── KakizomeApp.tsx      # Main app logic (auth + form)
│   │   └── ResultView.tsx       # Vertical writing kanji display
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── wrangler.toml                # Cloudflare configuration
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Features

1. **Hero Section:** Animated landing page with Framer Motion
2. **Authentication:** Simple password-based access control
3. **Input Form:** User-friendly form for reflection and goals
4. **AI Generation:** Gemini 2.0 Flash analyzes input and generates kanji
5. **Result Display:** Vertical writing (縦書き) with traditional seal (判子) design
6. **Responsive Design:** Works on desktop and mobile devices

## License

MIT License

## Author

Created for RSGT2026 LT Demo
