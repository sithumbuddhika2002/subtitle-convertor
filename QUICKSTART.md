# Quick Start Guide - Subtitle Converter

## Installation

Open PowerShell in the project directory (`e:\My projects\subtitle maker`) and run:

```powershell
# Install all dependencies
npm install

# If you encounter errors, try:
npm install --legacy-peer-deps
```

## Running the Application

```powershell
# Development mode (recommended for testing)
npm run dev
```

This will:
1. Start the Vite development server
2. Launch the Electron application window
3. Enable hot reload for instant updates

## Alternative: Using Electron Directly

If you want to run with Electron:

```powershell
npm run electron:dev
```

## Building for Production

```powershell
# Build the application
npm run electron:build
```

This creates a Windows installer in the `dist` folder.

## Troubleshooting

### npm Install Issues

If `npm install` fails, try these steps:

1. **Clear npm cache**:
   ```powershell
   npm cache clean --force
   ```

2. **Delete node_modules**:
   ```powershell
   Remove-Item -Recurse -Force node_modules, package-lock.json
   ```

3. **Reinstall**:
   ```powershell
   npm install --legacy-peer-deps
   ```

### Missing Dependencies

If specific packages are missing:

```powershell
# Install React and core dependencies
npm install react@18.2.0 react-dom@18.2.0 --save

# Install dev dependencies
npm install --save-dev @types/react @types/react-dom
```

## Using the Application

Once the application launches:

1. **Upload**: Drag and drop a subtitle file or click "Browse Files"
2. **Select Format**: Choose your desired output format (SRT, VTT, ASS, SSA, SUB)
3. **Convert**: Click the "Convert" button
4. **Preview**: Review the converted subtitle
5. **Download**: Save the converted file to your computer

## Supported Files

- `.srt` - SubRip
- `.vtt` - WebVTT
- `.ass` - Advanced SubStation Alpha
- `.ssa` - SubStation Alpha
- `.sub` - MicroDVD

All formats support **Sinhala (සිංහල)** Unicode text!

## Next Steps

- Test with your subtitle files
- Try converting between different formats
- Verify Sinhala text is displayed correctly
- Report any issues or suggest improvements

---

**Enjoy your professional subtitle converter!** 🎬
