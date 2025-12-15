import { SubtitleFormat, SubtitleEntry, ParsedSubtitle } from '../types/subtitle'

export class SubtitleParser {
    /**
     * Detect subtitle format from file content
     */
    static detectFormat(content: string): SubtitleFormat {
        const trimmed = content.trim()

        // Check for VTT
        if (trimmed.startsWith('WEBVTT')) {
            return SubtitleFormat.VTT
        }

        // Check for ASS/SSA
        if (trimmed.includes('[Script Info]') || trimmed.includes('[V4+ Styles]') || trimmed.includes('[V4 Styles]')) {
            if (trimmed.includes('[V4+ Styles]')) {
                return SubtitleFormat.ASS
            }
            return SubtitleFormat.SSA
        }

        // Check for SUB (MicroDVD) - typically starts with frame numbers
        const lines = trimmed.split('\n')
        const firstLine = lines[0].trim()
        if (firstLine.match(/^\{\\d+\}\{\\d+\}/)) {
            return SubtitleFormat.SUB
        }

        // Default to SRT (most common)
        return SubtitleFormat.SRT
    }

    /**
     * Parse subtitle file content
     */
    static parse(content: string, format?: SubtitleFormat): ParsedSubtitle {
        const detectedFormat = format || this.detectFormat(content)

        switch (detectedFormat) {
            case SubtitleFormat.SRT:
                return this.parseSRT(content)
            case SubtitleFormat.VTT:
                return this.parseVTT(content)
            case SubtitleFormat.ASS:
            case SubtitleFormat.SSA:
                return this.parseASS(content, detectedFormat)
            case SubtitleFormat.SUB:
                return this.parseSUB(content)
            default:
                throw new Error(`Unsupported format: ${detectedFormat}`)
        }
    }

    /**
     * Parse SRT format
     */
    private static parseSRT(content: string): ParsedSubtitle {
        const entries: SubtitleEntry[] = []
        const blocks = content.trim().split(/\n\s*\n/)

        for (const block of blocks) {
            const lines = block.trim().split('\n')
            if (lines.length < 3) continue

            const index = parseInt(lines[0])
            const timeLine = lines[1]
            const text = lines.slice(2).join('\n')

            // Parse time: 00:00:01,000 --> 00:00:04,000
            const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/)
            if (!timeMatch) continue

            const startTime = this.parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4])
            const endTime = this.parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8])

            entries.push({
                index,
                startTime,
                endTime,
                text: this.cleanText(text)
            })
        }

        return {
            format: SubtitleFormat.SRT,
            entries
        }
    }

    /**
     * Parse VTT format
     */
    private static parseVTT(content: string): ParsedSubtitle {
        const entries: SubtitleEntry[] = []
        const lines = content.split('\n')

        let index = 0
        let i = 0

        // Skip header
        while (i < lines.length && !lines[i].includes('-->')) {
            i++
        }

        while (i < lines.length) {
            const line = lines[i].trim()

            if (line.includes('-->')) {
                // Parse time: 00:00:01.000 --> 00:00:04.000
                const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/)
                if (timeMatch) {
                    const startTime = this.parseTime(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4])
                    const endTime = this.parseTime(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8])

                    // Collect text lines
                    i++
                    const textLines: string[] = []
                    while (i < lines.length && lines[i].trim() !== '') {
                        textLines.push(lines[i])
                        i++
                    }

                    entries.push({
                        index: ++index,
                        startTime,
                        endTime,
                        text: this.cleanText(textLines.join('\n'))
                    })
                }
            }
            i++
        }

        return {
            format: SubtitleFormat.VTT,
            entries
        }
    }

    /**
     * Parse ASS/SSA format
     */
    private static parseASS(content: string, format: SubtitleFormat): ParsedSubtitle {
        const entries: SubtitleEntry[] = []
        const lines = content.split('\n')

        let inEvents = false
        let index = 0

        for (const line of lines) {
            const trimmed = line.trim()

            if (trimmed === '[Events]') {
                inEvents = true
                continue
            }

            if (inEvents && trimmed.startsWith('Dialogue:')) {
                const parts = trimmed.substring(9).split(',')
                if (parts.length >= 10) {
                    const startTime = this.parseASSTime(parts[1])
                    const endTime = this.parseASSTime(parts[2])
                    const text = parts.slice(9).join(',')

                    entries.push({
                        index: ++index,
                        startTime,
                        endTime,
                        text: this.cleanASSText(text)
                    })
                }
            }
        }

        return {
            format,
            entries
        }
    }

    /**
     * Parse SUB (MicroDVD) format
     */
    private static parseSUB(content: string): ParsedSubtitle {
        const entries: SubtitleEntry[] = []
        const lines = content.trim().split('\n')
        const fps = 25 // Default frame rate

        let index = 0
        for (const line of lines) {
            const match = line.match(/\{(\d+)\}\{(\d+)\}(.*)/)
            if (match) {
                const startFrame = parseInt(match[1])
                const endFrame = parseInt(match[2])
                const text = match[3]

                entries.push({
                    index: ++index,
                    startTime: (startFrame / fps) * 1000,
                    endTime: (endFrame / fps) * 1000,
                    text: this.cleanText(text.replace(/\|/g, '\n'))
                })
            }
        }

        return {
            format: SubtitleFormat.SUB,
            entries
        }
    }

    /**
     * Helper: Parse time to milliseconds
     */
    private static parseTime(hours: string, minutes: string, seconds: string, ms: string): number {
        return parseInt(hours) * 3600000 + parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(ms)
    }

    /**
     * Helper: Parse ASS time format (0:00:01.00)
     */
    private static parseASSTime(timeStr: string): number {
        const parts = timeStr.trim().split(':')
        if (parts.length === 3) {
            const hours = parseInt(parts[0])
            const minutes = parseInt(parts[1])
            const secondsParts = parts[2].split('.')
            const seconds = parseInt(secondsParts[0])
            const centiseconds = secondsParts[1] ? parseInt(secondsParts[1]) : 0

            return hours * 3600000 + minutes * 60000 + seconds * 1000 + centiseconds * 10
        }
        return 0
    }

    /**
     * Helper: Clean subtitle text
     */
    private static cleanText(text: string): string {
        return text
            .replace(/<[^>]*>/g, '') // Remove basic HTML tags
            .replace(/\{\\[^}]*\}/g, '') // Remove formatting tags
            .trim()
    }

    /**
     * Helper: Clean ASS text
     */
    private static cleanASSText(text: string): string {
        return text
            .replace(/\\N/g, '\n') // ASS line break
            .replace(/\\n/g, '\n') // Alternative line break
            .replace(/\{[^}]*\}/g, '') // Remove ASS tags
            .trim()
    }
}
