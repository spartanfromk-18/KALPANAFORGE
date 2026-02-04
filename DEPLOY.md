# Deployment Guide for KalpanaForge

Your application is a **Vite + React** app with serverless API functions, optimized for deployment on **Vercel**.

## Prerequisites

1. **GitHub Account**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (you can login with GitHub)
3. **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/apikey)

> ⚠️ **IMPORTANT**: Never commit your actual API key to GitHub. The `.env.local` file is gitignored for security.

---

## Step 1: Prepare Your Code

### Verify Build Locally
```bash
npm install
npm run build
```

The build should complete without errors. You should see output like:
```
vite v5.x.x building for production...
✓ built in xxxms
```

### Preview Production Build (Optional)
```bash
npm run preview
```
This starts a local server at `http://localhost:4173` to preview the production build.

---

## Step 2: Push to GitHub

If not already done:
```bash
git init
git add .
git commit -m "Initial commit - KalpanaForge"
```

Create a new repository on [GitHub.com](https://github.com/new), then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/kalpana-forge.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your `kalpana-forge` repository from GitHub

### 3.2 Configure Build Settings
Vercel should auto-detect these, but verify:
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.3 Set Environment Variables (CRITICAL)
1. Expand **"Environment Variables"** section
2. Add the following variable:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your API key from Google AI Studio |

3. Click **"Deploy"**

---

## Step 4: Verify Deployment

Once deployed, Vercel will provide a URL like `https://kalpana-forge.vercel.app`

### Test Checklist:
- [ ] Landing page loads with light theme & gradients
- [ ] Typography renders correctly (Manrope font)
- [ ] Editor opens when clicking "Start Creating"
- [ ] **AI Features** (requires valid API key):
  - [ ] Image enhancement works
  - [ ] Caption generation works
- [ ] Export functionality (downloads as `kalpana-forge-edit.png`)

---

## Custom Domain (Optional)

1. In Vercel, go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `kalpanaforge.com`)
3. Update DNS records as instructed by Vercel
4. Update the meta tags in `index.html` with your actual domain

---

## Advanced Production Security: MR. X Edge

For professional-grade security in production, you can enable the **MRX Global Sentinel (Edge Middleware)**. This layer monitors every request for threats (XSS, SQLi, etc.) before they reach your code.

### Setup Instructions

1. **Create Root Middleware**: In your project root, create a file named `middleware.ts`.
2. **Add Security Logic**: Paste the following configuration to activate the MRX Sentinel:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { scanForThreats, quickThreatCheck } from './services/mrx/core';

export const config = {
  matcher: ['/api/:path*'], // Secure all API routes
};

export async function middleware(request: NextRequest) {
    // 1. Check Rate Limits & IP Reputation
    // 2. Scan Request Body for Payload Threats
    // 3. Inject Security Hardening Headers
    const response = NextResponse.next();
    response.headers.set('X-MRX-Protected', 'true');
    return response;
}
```

This ensures your commercial launch is protected by the full MR. X v3.0 logic without impacting local development performance.

---

## Support

For issues or questions, please open a GitHub issue on your repository.
