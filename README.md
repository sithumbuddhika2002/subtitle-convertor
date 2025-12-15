# Subtitle Converter

A professional, modern subtitle converter application with support for Sri Lankan Sinhala language and multiple subtitle formats.

![Subtitle Converter](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Multiple Format Support**: Convert between SRT, VTT, ASS, SSA, and SUB formats
- **Sinhala Language Support**: Full Unicode support for Sinhala text
- **Modern UI**: Beautiful glassmorphism design with smooth animations
- **Drag & Drop**: Easy file upload with drag-and-drop functionality
- **Live Preview**: Preview both original and converted subtitles
- **Fast Conversion**: Process subtitles instantly
- **File Download**: Save converted files directly to your system

## 🚀 Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| SubRip | `.srt` | Most common and widely supported |
| WebVTT | `.vtt` | Web-standard with styling support |
| Advanced SubStation Alpha | `.ass` | Advanced styling and effects |
| SubStation Alpha | `.ssa` | Legacy format with styling |
| MicroDVD | `.sub` | Frame-based subtitle format |

## 📦 Installation

### For Users

1. Download the latest installer from the [Releases](https://github.com/yourusername/subtitle-converter/releases) page
2. Run the installer (`Subtitle-Converter-Setup-1.0.0.exe`)
3. Follow the installation wizard
4. Launch "Subtitle Converter" from your Start Menu

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/subtitle-converter.git
cd subtitle-converter

# Install dependencies
npm install

# Run in development mode
npm run dev
```

## 🎯 Usage

1. **Upload Subtitle File**
   - Drag and drop a subtitle file onto the upload area
   - Or click "Browse Files" to select a file

2. **Select Target Format**
   - Choose your desired output format from the available options
   - The current format is automatically detected

3. **Convert**
   - Click "Convert to [FORMAT]" button
   - Preview the converted subtitle

4. **Download**
   - Click the "Download" button
   - Choose where to save your converted file

## 🛠️ Development

### Project Structure

```
subtitle-converter/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.ts     # Preload script
├── src/
│   ├── components/    # React components
│   │   ├── FileUploader.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── SubtitlePreview.tsx
│   │   └── ConversionProgress.tsx
│   ├── services/      # Business logic
│   │   ├── SubtitleParser.ts
│   │   └── SubtitleConverter.ts
│   ├── types/         # TypeScript types
│   │   └── subtitle.ts
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── public/            # Static assets
└── index.html         # HTML template
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Building
npm run build            # Build for production
npm run electron:build   # Create installer

# Preview
npm run preview          # Preview production build
```

### Technologies Used

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## 🌍 Language Support

The application fully supports **Sinhala** (සිංහල) Unicode text, using optimized fonts:
- Noto Sans Sinhala
- Iskoola Pota (Windows default)

All subtitle conversions preserve Sinhala characters correctly across all formats.

## ⚠️ Important Notes

- When converting from ASS/SSA to simpler formats (SRT, VTT, SUB), advanced styling will be lost
- SUB format uses a default frame rate of 25 FPS
- Always preview your converted subtitles before using them

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sithum**

## 🙏 Acknowledgments

- Subtitle format specifications from various open-source projects
- Sinhala Unicode support guidelines
- The open-source community for inspiration

---

Made with ❤️ for subtitle conversion
