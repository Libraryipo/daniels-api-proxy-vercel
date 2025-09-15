# Daniels Orchestral Music API Proxy

A Vercel-hosted proxy server for the Daniels Orchestral Music API, designed to work with Monday.com integrations.

## Features

- 🎼 Search orchestral works in the Daniels database
- 📊 Fetch detailed orchestration information
- 🔒 Secure server-side API credential handling
- 🌐 CORS-enabled for Monday.com integration
- ⚡ Serverless deployment on Vercel

## API Endpoints

### POST /api/search
Search for orchestral works by composer, title, or keywords.

**Request:**
```json
{
  "query": "Beethoven Symphony 9"
}
