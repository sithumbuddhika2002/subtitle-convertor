import { useState } from 'react'
import { FileUploader } from './components/FileUploader'
import { LanguageSelector } from './components/LanguageSelector'
import { SubtitlePreview } from './components/SubtitlePreview'
import { ConversionProgress } from './components/ConversionProgress'
import { SubtitleParser } from './services/SubtitleParser'
import { SubtitleConverter } from './services/SubtitleConverter'
import { TranslationService } from './services/TranslationService'
import { ParsedSubtitle, Language, TranslationResult } from './types/subtitle'
import { Download, Languages } from 'lucide-react'

function App() {
    const [file, setFile] = useState<{ name: string; content: string } | null>(null)
    const [parsed, setParsed] = useState<ParsedSubtitle | null>(null)
    const [sourceLanguage, setSourceLanguage] = useState<Language>(Language.AUTO_DETECT)
    const [targetLanguage, setTargetLanguage] = useState<Language>(Language.SINHALA)
    const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null)
    const [isTranslating, setIsTranslating] = useState(false)
    const [isParsing, setIsParsing] = useState(false)
    const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 })

    const handleFileSelect = async (content: string, fileName: string) => {
        setFile({ name: fileName, content })
        setIsParsing(true)

        try {
            const parsedData = SubtitleParser.parse(content)
            setParsed(parsedData)
            setTranslationResult(null)

            // Auto-detect language from first subtitle entry (non-blocking)
            if (parsedData.entries.length > 0) {
                try {
                    const detectedLang = await TranslationService.detectLanguage(
                        parsedData.entries[0].text
                    )
                    setSourceLanguage(detectedLang)
                } catch (error) {
                    console.warn('Language detection failed, using default')
                    // Keep default language if detection fails
                }
            }
        } catch (error) {
            console.error('Failed to parse subtitle:', error)
            setParsed(null)
            alert('Failed to parse subtitle file. Please ensure it is a valid subtitle format.')
        } finally {
            setIsParsing(false)
        }
    }

    const handleTranslate = async () => {
        if (!parsed) return

        setIsTranslating(true)
        setTranslationProgress({ current: 0, total: parsed.entries.length })

        try {
            const result = await TranslationService.translateSubtitle(
                parsed,
                sourceLanguage,
                targetLanguage,
                (current, total) => {
                    setTranslationProgress({ current, total })
                }
            )

            // If translation was successful, generate output file content
            if (result.success && result.translatedSubtitle) {
                const outputContent = SubtitleConverter.convert(
                    result.translatedSubtitle,
                    parsed.format
                ).output

                setTranslationResult({
                    ...result,
                    output: outputContent,
                })
            } else {
                setTranslationResult(result)
            }
        } catch (error) {
            console.error('Translation error:', error)
            setTranslationResult({
                success: false,
                errors: [error instanceof Error ? error.message : 'Translation failed'],
                entriesProcessed: 0,
                timeElapsed: 0,
            })
        } finally {
            setIsTranslating(false)
            setTranslationProgress({ current: 0, total: 0 })
        }
    }

    const handleDownload = () => {
        if (!translationResult || !translationResult.output || !file) return

        const fileExtension = parsed?.format || 'srt'
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        const langSuffix = targetLanguage === Language.SINHALA ? 'sinhala' : targetLanguage
        const defaultName = `${baseName}_${langSuffix}.${fileExtension}`

        // Create download link
        const blob = new Blob([translationResult.output], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = defaultName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleReset = () => {
        setFile(null)
        setParsed(null)
        setTranslationResult(null)
        setSourceLanguage(Language.AUTO_DETECT)
        setTargetLanguage(Language.SINHALA)
    }

    return (
        <div className="min-h-screen w-full p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12 animate-slide-down">
                    <div className="flex items-center justify-center mb-4">
                        <Languages className="w-12 h-12 text-primary-400 mr-3" />
                        <h1 className="text-5xl font-bold text-gradient">
                            Subtitle Translator
                        </h1>
                    </div>
                    <p className="text-lg text-white/70">
                        Automatic subtitle translation with Sinhala language support
                    </p>
                    <p className="text-sm text-white/50 mt-2">
                        Translate subtitles to 40+ languages while preserving timing
                    </p>
                </header>

                {/* Main Content */}
                <div className="space-y-8">
                    {!file ? (
                        <FileUploader onFileSelect={handleFileSelect} />
                    ) : isParsing ? (
                        <ConversionProgress type="parsing" />
                    ) : (
                        <>
                            {/* File Info */}
                            <div className="card animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">Loaded File</h3>
                                        <p className="text-white/70">{file.name}</p>
                                        {parsed && (
                                            <p className="text-sm text-white/50 mt-1">
                                                Format: {parsed.format.toUpperCase()} • {parsed.entries.length} entries
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="btn-secondary"
                                    >
                                        Load Different File
                                    </button>
                                </div>
                            </div>

                            {/* Language Selection */}
                            {parsed && !translationResult && (
                                <div className="animate-slide-up">
                                    <LanguageSelector
                                        sourceLanguage={sourceLanguage}
                                        targetLanguage={targetLanguage}
                                        onSourceLanguageChange={setSourceLanguage}
                                        onTargetLanguageChange={setTargetLanguage}
                                        onTranslate={handleTranslate}
                                        disabled={isTranslating}
                                    />
                                </div>
                            )}

                            {/* Translation Progress */}
                            {isTranslating && parsed && (
                                <ConversionProgress
                                    type="translation"
                                    currentStep={translationProgress.current}
                                    totalSteps={translationProgress.total}
                                />
                            )}

                            {/* Translation Result */}
                            {translationResult && translationResult.success && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Success Message */}
                                    <div className="card bg-green-500/20 border-green-500/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-semibold text-green-400 mb-2">
                                                    ✓ Translation Successful!
                                                </h3>
                                                <p className="text-white/70">
                                                    Translated {translationResult.entriesProcessed} entries in {translationResult.timeElapsed}ms
                                                </p>
                                                {translationResult.detectedLanguage && sourceLanguage === Language.AUTO_DETECT && (
                                                    <p className="text-sm text-blue-400 mt-2">
                                                        🔍 Detected source language: {translationResult.detectedLanguage.toUpperCase()}
                                                    </p>
                                                )}
                                                {translationResult.warnings && translationResult.warnings.length > 0 && (
                                                    <div className="mt-3 text-sm text-yellow-400">
                                                        ⚠ {translationResult.warnings.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleDownload}
                                                className="btn-primary flex items-center gap-2"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download Translation
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <SubtitlePreview
                                        original={file.content}
                                        converted={translationResult.output || ''}
                                        originalLanguage={translationResult.detectedLanguage || sourceLanguage}
                                        convertedLanguage={targetLanguage}
                                    />

                                    {/* Translate Another */}
                                    <div className="text-center">
                                        <button
                                            onClick={() => {
                                                setTranslationResult(null)
                                            }}
                                            className="btn-secondary"
                                        >
                                            Translate to Another Language
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Translation Error */}
                            {translationResult && !translationResult.success && (
                                <div className="card bg-red-500/20 border-red-500/50 animate-fade-in">
                                    <h3 className="text-xl font-semibold text-red-400 mb-3">
                                        ✗ Translation Failed
                                    </h3>
                                    {translationResult.errors && (
                                        <div className="space-y-3">
                                            <ul className="text-white/70 space-y-2">
                                                {translationResult.errors.map((error, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-red-400 mt-0.5">•</span>
                                                        <span>{error}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Helpful suggestions for common errors */}
                                            {translationResult.errors.some(e => e.includes('fetch') || e.includes('connection')) && (
                                                <div className="glass-dark rounded-lg p-4 text-sm text-white/80">
                                                    <p className="font-semibold text-yellow-400 mb-2">💡 Troubleshooting Tips:</p>
                                                    <ul className="space-y-1 text-white/70">
                                                        <li>• Make sure the Python translation server is running</li>
                                                        <li>• Run: <code className="bg-black/30 px-2 py-0.5 rounded">python python/translation_server.py</code></li>
                                                        <li>• Check that port 5000 is not blocked by firewall</li>
                                                        <li>• Verify the server is accessible at <code className="bg-black/30 px-2 py-0.5 rounded">http://localhost:5000</code></li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setTranslationResult(null)}
                                        className="btn-secondary mt-4"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-white/50 text-sm">
                    <p>Built with ❤️ for subtitle translation</p>
                </footer>
            </div>
        </div>
    )
}

export default App

