import React, { useState, useCallback } from 'react'
import { Upload, File } from 'lucide-react'

interface FileUploaderProps {
    onFileSelect: (content: string, fileName: string) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = async (file: globalThis.File) => {
        const content = await file.text()
        onFileSelect(content, file.name)
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            handleFile(file)
        }
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleClick = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.srt,.vtt,.ass,.ssa,.sub'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                handleFile(file)
            }
        }
        input.click()
    }

    return (
        <div className="animate-fade-in">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
                className={`
          relative card cursor-pointer min-h-[400px] flex flex-col items-center justify-center
          transition-all duration-300 group
          ${isDragging ? 'border-primary-500 bg-primary-500/20 scale-105' : 'hover:border-primary-400 hover:scale-[1.02]'}
        `}
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 animate-gradient rounded-xl"></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <div className={`
            mb-6 transition-all duration-300
            ${isDragging ? 'scale-110' : 'group-hover:scale-105'}
          `}>
                        {isDragging ? (
                            <File className="w-24 h-24 text-primary-400 animate-pulse mx-auto" />
                        ) : (
                            <Upload className="w-24 h-24 text-primary-400 group-hover:text-primary-300 transition-colors mx-auto" />
                        )}
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-gradient">
                        {isDragging ? 'Drop Your File Here' : 'Upload Subtitle File'}
                    </h2>

                    <p className="text-lg text-white/70 mb-6">
                        Drag and drop your subtitle file or click to browse
                    </p>

                    <div className="space-y-2 text-sm text-white/50">
                        <p>Supported formats:</p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {['SRT', 'VTT', 'ASS', 'SSA', 'SUB'].map((format) => (
                                <span
                                    key={format}
                                    className="px-3 py-1 glass-dark rounded-full text-xs font-semibold"
                                >
                                    {format}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button className="btn-primary mt-8">
                        Browse Files
                    </button>
                </div>
            </div>
        </div>
    )
}
