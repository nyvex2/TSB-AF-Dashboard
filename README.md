# TSB-AF Dashboard

Standalone React + TypeScript + Vite dashboard for the TSB-AF Discord bot.

## Implemented
- Discord OAuth2 sign-in.
- Server access limited to users with Manage Server or Administrator permission, where the bot is installed.
- Signed HTTP-only dashboard session cookie.
- Per-server prefix configuration sync.
- Up to 25 independent application panels.
- Custom embed title, description, color and button label.
- Up to five Discord modal questions per panel (Discord platform limit).
- Separate panel channel, review channel and reviewer role.
- Publish or update application embeds directly in Discord.
- Persistent application buttons restored after bot restart.
- Application submissions stored in MongoDB and reviewed through the bot's existing accept/reject workflow.

## Architecture
This repository is the frontend, deployed as a Vite site (for example on Vercel). The bot-side API runs in the existing Python bot process and uses its MongoDB state. The browser never receives the Discord bot token, OAuth client secret, MongoDB URI or session signing secret. The Vercel proxy forwards the browser's original Origin header so cross-site state-changing requests are rejected.

## Deploy the dashboard
1. Import this repository into Vercel.
2. Select Vite.
3. Build command: pnpm build (or npm run build).
4. Output directory: dist.
5. Add the server-side Vercel environment variable BOT_API_URL (the actual Wispbyte bot API URL).
6. Redeploy. The included Vercel proxy keeps Discord OAuth cookies first-party on the dashboard domain.

## Configure the bot API
In the Discord Developer Portal, register this OAuth2 redirect URL:
https://YOUR-DASHBOARD.vercel.app/auth/callback

Add these environment variables to the bot host:
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- DASHBOARD_API_URL (the same deployed dashboard origin; OAuth callback is proxied through Vercel)
- DASHBOARD_URL (exact deployed dashboard origin)
- DASHBOARD_SESSION_SECRET (long random secret, at least 32 characters)
- DASHBOARD_PORT (public port allocated to the bot service)

Keep DISCORD_TOKEN, MONGODB_URI and MONGODB_DB configured. Never put secrets in this repository or in VITE_* variables. Restart the bot after adding the variables. The host must expose the selected API port publicly over HTTPS.

## Publish an application
1. Sign in with Discord.
2. Select a server where you have Manage Server or Administrator and the bot is installed.
3. Open Applications and create or edit a panel.
4. Set the panel channel, review channel and reviewer role using exact Discord names.
5. Add 1–5 questions.
6. Enable the panel and save changes.
7. Click Publish embed. The bot posts the embed and persistent Apply button.
8. Applicants submit the modal; the bot stores the application in MongoDB and posts it for staff review.

## Current scope
The prefix, moderation configuration, clan configuration and application panel flows are connected. Actual moderation actions, clan actions, audit history and web-based accept/reject review are not implemented in this build; those actions remain available through the bot commands and Discord review buttons. Existing bot slash commands remain available.

## Local development
pnpm install
pnpm dev

Build:
pnpm build
