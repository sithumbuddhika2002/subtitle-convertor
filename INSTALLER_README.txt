===================================================
  SUBTITLE TRANSLATOR v1.0.0 - Installation Guide
===================================================

STEP 1: RUN THE INSTALLER
--------------------------
1. Double-click "subtitle-converter Setup 1.0.0.exe"
2. If Windows SmartScreen appears:
   - Click "More info"
   - Click "Run anyway"
3. Click "Yes" on User Account Control prompt
4. Wait for installation to complete

STEP 2: LAUNCH THE APP
-----------------------
- Desktop shortcut: Double-click "Subtitle Translator"
- Start Menu: Search for "Subtitle Translator"

FEATURES
--------
✓ Convert subtitle formats (SRT, VTT, ASS, SSA, SUB)
✓ Full Sinhala (සිංහල) language support
✓ Drag & drop file upload
✓ Real-time preview
✓ Translation to 40+ languages*

*Translation feature requires Python backend (optional)

SYSTEM REQUIREMENTS
-------------------
- Windows 10/11 (64-bit)
- 4GB RAM minimum
- 150MB free disk space

FOR TRANSLATION FEATURE (Optional)
----------------------------------
If you want to translate subtitles:

1. Install Python 3.8+ from python.org
2. Install packages:
   pip install googletrans==4.0.0-rc1 flask flask-cors
3. Run translation server:
   python translation_server.py
   (Keep this window open while using translation)

Note: Format conversion works WITHOUT Python

UNINSTALL
---------
Settings → Apps → Subtitle Translator → Uninstall

SUPPORT
-------
For issues or questions, contact the developer.

===================================================
        Built with Sithum Buddhika Team
===================================================
