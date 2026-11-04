# TSB-AF Dashboard

A standalone web dashboard project for the TSB-AF Discord bot.

## Current status

This repository contains the first dashboard UI scaffold, built with React, TypeScript and Vite.

### Included in this first build
- Dashboard overview and navigation
- Multiple application panel editor
- Embed title, description, color and button preview
- Configurable panel and review channel fields
- Staff review role field
- Add, edit, enable, disable and delete application panels
- Add, edit and mark application questions as required
- Moderation and clan configuration screens
- Bot settings screen with command prefix field
- Responsive layout for mobile

## Important: integration is not connected yet

The current interface is a frontend preview. It does not yet authenticate with Discord, save settings to a database, publish embeds, receive applications, or change the running bot's prefix. Those features require a secure bot-side API, Discord OAuth2 login, persistent storage, and matching handlers in the bot.

Never put a Discord bot token or client secret in frontend code or commit them to this repository. Configure secrets as deployment environment variables.

## Run locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Deploy

This is a Vite app and can be deployed to Vercel with:
- Framework preset: Vite
- Build command: `pnpm build`
- Output directory: `dist`

The bot integration should be implemented before treating the dashboard as production-ready.
