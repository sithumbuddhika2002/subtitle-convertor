import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, Languages, FileText, Sparkles } from 'lucide-react'

interface ConversionProgressProps {
    type?: 'translation' | 'conversion' | 'parsing'
    currentStep?: number
    totalSteps?: number
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
    type = 'translation',
    currentStep = 0,
    totalSteps = 0
}) => {
    const [currentMessage, setCurrentMessage] = useState(0)

    const messages = {
        translation: [
            { icon: Languages, text: 'Connecting to translation server...', status: 'active' },
            { icon: Sparkles, text: 'Detecting source language...', status: 'active' },
            { icon: FileText, text: 'Processing subtitle entries...', status: 'active' },
            { icon: Languages, text: 'Translating text blocks...', status: 'active' },
            { icon: CheckCircle2, text: 'Preserving timing information...', status: 'active' },
            { icon: Sparkles, text: 'Finalizing translation...', status: 'active' },
        ],
        conversion: [
            { icon: FileText, text: 'Parsing subtitle file...', status: 'active' },
            { icon: Sparkles, text: 'Converting format...', status: 'active' },
            { icon: CheckCircle2, text: 'Validating output...', status: 'active' },
            { icon: Languages, text: 'Finalizing conversion...', status: 'active' },
        ],
        parsing: [
            { icon: FileText, text: 'Reading file contents...', status: 'active' },
            { icon: Sparkles, text: 'Detecting subtitle format...', status: 'active' },
            { icon: CheckCircle2, text: 'Parsing entries...', status: 'active' },
        ]
    }

    const currentMessages = messages[type]
    const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % currentMessages.length)
        }, 2000)

        return () => clearInterval(interval)
    }, [currentMessages.length])

    const getTitle = () => {
        switch (type) {
            case 'translation':
                return '🌍 Translating Subtitles...'
            case 'conversion':
                return '⚙️ Converting Format...'
            case 'parsing':
                return '📄 Parsing File...'
            default:
                return 'Processing...'
        }
    }

    return (
        <div className="card text-center animate-fade-in">
            {/* Loading Spinner */}
            <div className="mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 animate-pulse"></div>
                </div>
                <Loader2 className="w-16 h-16 text-primary-400 animate-spin mx-auto relative z-10" />
            </div>

            <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>

            {totalSteps > 0 && (
                <p className="text-white/60 text-sm mb-6">
                    Processing {currentStep} of {totalSteps} entries
                </p>
            )}

            {/* Dynamic Status Messages */}
            <div className="space-y-3 max-w-md mx-auto mb-6">
                {currentMessages.map((message, index) => {
                    const Icon = message.icon
                    const isActive = index === currentMessage
                    const isPast = index < currentMessage

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 text-left transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100'
                                }`}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                opacity: isActive ? 1 : isPast ? 0.4 : 0.3
                            }}
                        >
                            <Icon
                                className={`w-5 h-5 ${isActive
                                        ? 'text-primary-400 animate-pulse'
                                        : isPast
                                            ? 'text-green-400'
                                            : 'text-white/30'
                                    }`}
                            />
                            <span className={`${isActive
                                    ? 'text-white font-medium'
                                    : 'text-white/50'
                                }`}>
                                {message.text}
                            </span>
                            {isPast && (
                                <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 space-y-2">
                {totalSteps > 0 && (
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                )}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
                        style={{
                            width: totalSteps > 0 ? `${progressPercentage}%` : '100%',
                            animation: totalSteps > 0 ? 'none' : 'shimmer 2s infinite'
                        }}
                    ></div>
                </div>
            </div>

            <p className="text-white/40 text-xs mt-4">
                Please wait, this may take a few moments...
            </p>
        </div>
    )
}
