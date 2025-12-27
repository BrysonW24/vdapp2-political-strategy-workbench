# Quick Start Guide - Political Strategy Workbench Backend

## Issue: Prisma Cache Directory Problem

There's a known Windows issue with the Prisma cache directory. Here's how to fix it:

### Solution 1: PowerShell Script (Easiest)

Open **PowerShell** in this directory and run:

```powershell
.\fix-cache.ps1
npx prisma generate
npx prisma db push
npm run start:dev
```

### Solution 2: Manual PowerShell Commands

Open **PowerShell** (not Git Bash) in this directory:

```powershell
# Remove corrupted cache
Remove-Item -Path "node_modules\.cache" -Force -Recurse -ErrorAction SilentlyContinue

# Create proper directory
New-Item -ItemType Directory -Path "node_modules\.cache\prisma" -Force

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start the server
npm run start:dev
```

### Solution 3: Command Prompt

Open **Command Prompt** as Administrator:

```cmd
cd backend\api-server

# Remove cache
rd /s /q node_modules\.cache 2>nul

# Create directory
mkdir node_modules\.cache\prisma

# Generate Prisma
npx prisma generate

# Push schema
npx prisma db push

# Start server
npm run start:dev
```

## After the Backend Starts

1. Frontend is already running at: http://localhost:3000
2. Backend will run at: http://localhost:3001
3. Visit the News page: http://localhost:3000/news
4. Click "Refresh News" to fetch live Australian news!

## What You'll See

The News Intelligence page will display real articles from:
- ABC News
- The Guardian Australia
- News.com.au

With features:
- Beautiful card layouts
- Category filtering (Politics, Business, Technology, etc.)
- Source filtering
- Sentiment indicators
- Direct links to original articles
- Refresh button for latest news

## API Endpoints

Once running, you can also test the API directly:

- Health Check: http://localhost:3001/api/health
- Swagger Docs: http://localhost:3001/api/docs
- Fetch News: http://localhost:3001/api/news-aggregation/fetch
- Get Articles: http://localhost:3001/api/news-articles

## Guardian API Key

Already configured in `.env`:
```
GUARDIAN_API_KEY=1832cf61-dd4f-4794-a74c-5e38fe454d27
```

## Need Help?

- Frontend issues: Check http://localhost:3000 is running
- Backend issues: Check PostgreSQL is running on port 5432
- Database issues: Make sure `political_strategy_db` database exists
- API issues: Check backend logs in the terminal
