import React, { useState } from 'react'
import { SubtitleFormat, Language, LanguageNames } from '../types/subtitle'
import { Eye, Code } from 'lucide-react'

interface SubtitlePreviewProps {
    original: string
    converted: string
    originalFormat?: SubtitleFormat
    convertedFormat?: SubtitleFormat
    originalLanguage?: Language
    convertedLanguage?: Language
}

export const SubtitlePreview: React.FC<SubtitlePreviewProps> = ({
    original,
    converted,
    originalFormat,
    convertedFormat,
    originalLanguage,
    convertedLanguage,
}) => {
    const [showOriginal, setShowOriginal] = useState(false)

    // Determine label to show
    const getLabel = (isOriginal: boolean) => {
        if (isOriginal) {
            if (originalLanguage) {
                return LanguageNames[originalLanguage]
            }
            return originalFormat?.toUpperCase() || 'Original'
        } else {
            if (convertedLanguage) {
                return LanguageNames[convertedLanguage]
            }
            return convertedFormat?.toUpperCase() || 'Converted'
        }
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary-400" />
                    Preview
                </h2>

                <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                >
                    <Code className="w-4 h-4" />
                    {showOriginal ? 'Show Translated' : 'Show Original'}
                </button>
            </div>

            {/* Preview Content */}
            <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-primary-500/80 backdrop-blur rounded-full text-xs font-semibold">
                        {getLabel(showOriginal)}
                    </span>
                </div>

                <div className="glass-dark rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
                    <pre className="text-sm font-mono text-white/90 whitespace-pre-wrap sinhala-text">
                        {showOriginal ? original : converted}
                    </pre>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-white/50">
                <div>
                    Lines: {(showOriginal ? original : converted).split('\n').length}
                </div>
                <div>
                    Characters: {(showOriginal ? original : converted).length}
                </div>
            </div>
        </div>
    )
}

