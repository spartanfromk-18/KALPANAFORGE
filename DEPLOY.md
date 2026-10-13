# Deployment Guide for KalpanaForge

Your application is a **Vite + React** app with serverless API functions, optimized for deployment on **Vercel**.

## Prerequisites

1. **GitHub Account**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (you can login with GitHub)
3. **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/apikey)
4. **Supabase project**: Enable Email Auth and choose whether email confirmation is required (the client assumes it is enabled).
5. **Upstash Redis database**: Create a REST database and copy its URL and token.

> ⚠️ **IMPORTANT**: Never commit your actual API key to GitHub. The `.env.local` file is gitignored for security.

---

## Step 1: Prepare Your Code
### Verify Build Locally
```bash
npm ci
npm run build
npm run verify
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
| `GEMINI_API_KEY` | Server-only key from Google AI Studio |
| `AI_PROVIDER` | `gemini` (or `openai`) |
| `AI_MODEL` | Gemini or OpenAI-compatible model name |
| `OPENAI_API_KEY` | Optional; required only when `AI_PROVIDER=openai` |
| `OPENAI_API_BASE` | Optional; defaults to `https://api.openai.com/v1` |
| `ALLOWED_ORIGIN` | Comma-separated production origin allowlist, for example `https://app.example.com` |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anon key |

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

## Supabase and Upstash setup

In Supabase, create the project, enable Email Auth, and configure the site URL and allowed redirect URLs for the Vercel domain. The browser uses Supabase Auth; API routes validate the Supabase access token server-side. Do not expose a service-role key.

In Upstash, create a Redis database and add its REST URL and token to Vercel. The Vercel Edge middleware rate-limits API requests by IP, and the API handlers apply a second limit by authenticated user. Missing KV credentials fail safe with a log and do not crash requests.

### Deploy steps

1. Import the repository into Vercel with the `Vite` preset.
2. Set the variables above for Production, Preview, and Development as appropriate.
3. Deploy with `npm run build` and verify the deployed app, sign-up, email-confirmed login, and both AI routes.
4. Set `ALLOWED_ORIGIN` to the exact HTTPS frontend origin before production traffic.

---

## Support

For issues or questions, please open a GitHub issue on your repository.
