import React from 'react'
import { Language, LanguageNames } from '../types/subtitle'
import { Languages, ArrowRight } from 'lucide-react'

interface LanguageSelectorProps {
    sourceLanguage: Language
    targetLanguage: Language
    onSourceLanguageChange: (language: Language) => void
    onTargetLanguageChange: (language: Language) => void
    onTranslate: () => void
    disabled?: boolean
}

// Popular languages to show at the top
const POPULAR_LANGUAGES = [
    Language.SINHALA,
    Language.ENGLISH,
    Language.SPANISH,
    Language.FRENCH,
    Language.GERMAN,
    Language.HINDI,
    Language.JAPANESE,
    Language.KOREAN,
    Language.CHINESE_SIMPLIFIED,
    Language.ARABIC,
]

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    sourceLanguage,
    targetLanguage,
    onSourceLanguageChange,
    onTargetLanguageChange,
    onTranslate,
    disabled = false,
}) => {
    // Get all languages for dropdown
    const allLanguages = Object.values(Language).filter(lang => lang !== Language.AUTO_DETECT)
    const sourceLanguageOptions = [Language.AUTO_DETECT, ...allLanguages]

    return (
        <div className="card space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <Languages className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-bold">Select Languages</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Language */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/80">
                        Source Language
                    </label>
                    <select
                        value={sourceLanguage}
                        onChange={(e) => onSourceLanguageChange(e.target.value as Language)}
                        className="input-field cursor-pointer"
                        disabled={disabled}
                    >
                        {sourceLanguageOptions.map((lang) => (
                            <option key={lang} value={lang}>
                                {LanguageNames[lang]}
                                {POPULAR_LANGUAGES.includes(lang) && ' ⭐'}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-white/50">
                        Select "Auto Detect" to automatically identify the language
                    </p>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-primary-400 animate-pulse" />
                </div>

                {/* Target Language */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/80">
                        Target Language
                    </label>
                    <select
                        value={targetLanguage}
                        onChange={(e) => onTargetLanguageChange(e.target.value as Language)}
                        className="input-field cursor-pointer"
                        disabled={disabled}
                    >
                        {allLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {LanguageNames[lang]}
                                {POPULAR_LANGUAGES.includes(lang) && ' ⭐'}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-white/50">
                        Choose the language you want to translate to
                    </p>
                </div>
            </div>

            {/* Popular Languages Quick Select */}
            <div className="pt-4 border-t border-white/10">
                <p className="text-sm font-semibold text-white/70 mb-3">
                    Popular Target Languages:
                </p>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_LANGUAGES.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => onTargetLanguageChange(lang)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${targetLanguage === lang
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg scale-105'
                                    : 'glass text-white/80 hover:bg-white/20'
                                }`}
                            disabled={disabled}
                        >
                            {LanguageNames[lang].split('(')[0].trim()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Translate Button */}
            <div className="pt-4">
                <button
                    onClick={onTranslate}
                    disabled={disabled || targetLanguage === Language.AUTO_DETECT}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                >
                    <Languages className="w-5 h-5" />
                    Translate Subtitles
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Info Message */}
            <div className="glass-dark p-4 rounded-lg">
                <p className="text-sm text-white/70 leading-relaxed">
                    <span className="font-semibold text-primary-400">ℹ️ Note:</span> Translation
                    preserves all subtitle timing and formatting. The output will maintain the
                    original subtitle format (SRT, VTT, ASS, etc.) with translated text.
                </p>
            </div>
        </div>
    )
}
