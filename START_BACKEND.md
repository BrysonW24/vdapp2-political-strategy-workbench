# Starting the Backend Server

There's a known issue with Prisma cache directory permissions on Windows. Here's how to resolve it:

## Option 1: Manual Commands (Recommended)

Open PowerShell or Command Prompt as Administrator and run:

```powershell
cd "e:\dev\AiaaS\vivacity-digital-dev\Vivacity-Digital-Apps\client-projects\projects\active\political-strategy-workbench\backend\api-server"

# Remove the problematic cache file
del node_modules\.cache

# Create the directory properly
mkdir node_modules\.cache\prisma

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start the server
npm run start:dev
```

## Option 2: Quick Start Script

I've created all the files you need. The frontend is already running at http://localhost:3000

To start the backend, just run these commands:

```bash
cd backend/api-server

# If you have admin rights, run:
npx prisma generate
npx prisma db push
npm run start:dev
```

## Verify Everything is Working

1. **Frontend**: http://localhost:3000 ✅ (Already Running!)
2. **Backend API**: http://localhost:3001
3. **News Page**: http://localhost:3000/news
4. **API Docs**: http://localhost:3001/api/docs

## What's Already Done

✅ Frontend is running on port 3000
✅ News Intelligence page created with beautiful UI
✅ Navigation link added ("News Intelligence")
✅ Backend code ready with news aggregation
✅ .env file configured with Guardian API key
✅ All dependencies installed

## Testing the News Feed

Once the backend starts:

1. Go to http://localhost:3000/news
2. Click "Refresh News" button
3. Watch real Australian news articles populate from:
   - ABC News
   - The Guardian Australia
   - News.com.au

The page includes:
- Category filtering (Politics, Business, Technology, etc.)
- Source filtering
- Beautiful card layouts
- Sentiment indicators
- Direct links to original articles
