import React from 'react'
import { SubtitleFormat } from '../types/subtitle'
import { ArrowRight, Check } from 'lucide-react'

interface FormatSelectorProps {
    currentFormat: SubtitleFormat
    targetFormat: SubtitleFormat
    onFormatChange: (format: SubtitleFormat) => void
    onConvert: () => void
}

const formatInfo: Record<SubtitleFormat, { name: string; description: string }> = {
    [SubtitleFormat.SRT]: {
        name: 'SubRip (SRT)',
        description: 'Most common and widely supported format'
    },
    [SubtitleFormat.VTT]: {
        name: 'WebVTT (VTT)',
        description: 'Web-standard format with styling support'
    },
    [SubtitleFormat.ASS]: {
        name: 'Advanced SubStation Alpha (ASS)',
        description: 'Advanced format with rich styling options'
    },
    [SubtitleFormat.SSA]: {
        name: 'SubStation Alpha (SSA)',
        description: 'Legacy format with styling support'
    },
    [SubtitleFormat.SUB]: {
        name: 'MicroDVD (SUB)',
        description: 'Simple frame-based subtitle format'
    },
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
    currentFormat,
    targetFormat,
    onFormatChange,
    onConvert,
}) => {
    const formats = Object.values(SubtitleFormat)

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6">Select Target Format</h2>

            {/* Current Format Display */}
            <div className="mb-6 p-4 glass-dark rounded-lg">
                <p className="text-sm text-white/50 mb-1">Current Format</p>
                <p className="text-lg font-semibold text-primary-400">
                    {formatInfo[currentFormat].name}
                </p>
            </div>

            {/* Format Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {formats.map((format) => {
                    const isSelected = format === targetFormat
                    const isCurrent = format === currentFormat

                    return (
                        <button
                            key={format}
                            disabled={isCurrent}
                            onClick={() => onFormatChange(format)}
                            className={`
                relative p-5 rounded-lg border-2 text-left transition-all duration-300
                ${isCurrent
                                    ? 'bg-white/5 border-white/10 cursor-not-allowed opacity-50'
                                    : isSelected
                                        ? 'bg-primary-500/20 border-primary-500 scale-105 shadow-lg shadow-primary-500/50'
                                        : 'bg-white/5 border-white/20 hover:border-primary-400 hover:bg-white/10 hover:scale-102'
                                }
              `}
                        >
                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Format Badge */}
                            <div className={`
                inline-block px-3 py-1 rounded-full text-xs font-bold mb-3
                ${isSelected ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70'}
              `}>
                                {format.toUpperCase()}
                            </div>

                            <h3 className="font-semibold text-white mb-1">
                                {formatInfo[format].name.split('(')[0]}
                            </h3>
                            <p className="text-sm text-white/60">
                                {formatInfo[format].description}
                            </p>

                            {isCurrent && (
                                <div className="mt-2 text-xs text-white/50">
                                    (Current format)
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Convert Button */}
            <div className="flex justify-center">
                <button
                    onClick={onConvert}
                    disabled={targetFormat === currentFormat}
                    className={`
            btn-primary flex items-center gap-3 text-lg
            ${targetFormat === currentFormat ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    Convert to {targetFormat.toUpperCase()}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
