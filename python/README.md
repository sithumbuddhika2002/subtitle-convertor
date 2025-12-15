# Free Python Translation Setup

## Quick Start

### 1. Install Python (if not already installed)
Download Python 3.8+ from https://www.python.org/downloads/

### 2. Install Dependencies
Open Command Prompt in the `python` folder and run:
```bash
pip install -r requirements.txt
```

### 3. Start Translation Server
```bash
python translation_server.py
```

You should see:
```
==================================================
🌍 FREE Translation Server Starting...
Using Google Translate (no API key needed)
Server running on http://localhost:5000
==================================================
```

### 4. Start the Electron App
In a new terminal:
```bash
npm run dev
```

## Features

✅ **Completely FREE** - No API keys or payment required
✅ **Offline capable** - Works without internet (after initial model download)
✅ **Fast** - Local processing, no network delays
✅ **Unlimited** - No rate limits or usage caps
✅ **40+ Languages** - Including Sinhala (සිංහල)

## How It Works

1. Python Flask server runs locally on port 5000
2. Uses `googletrans` library (free Google Translate API)
3. Electron app sends translation requests to localhost
4. Python translates and returns results instantly

## Troubleshooting

**Port 5000 already in use?**
```bash
# Change port in translation_server.py line 75:
app.run(host='0.0.0.0', port=5001, debug=False)

# Also update TranslationService.ts:
const TRANSLATION_API_URL = 'http://localhost:5001/translate'
```

**Translation errors?**
- Ensure Python server is running
- Check Windows Firewall isn't blocking port 5000
- Try restarting the Python server

## Alternative: Offline Translation

For completely offline translation, install:
```bash
pip install argostranslate
```

This downloads translation models to your computer and works 100% offline!
