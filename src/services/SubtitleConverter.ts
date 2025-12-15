import { SubtitleFormat, SubtitleEntry, ParsedSubtitle, ConversionResult } from '../types/subtitle'

export class SubtitleConverter {
    /**
     * Convert subtitle to specified format
     */
    static convert(parsed: ParsedSubtitle, targetFormat: SubtitleFormat): ConversionResult {
        const startTime = Date.now()

        try {
            let output: string

            switch (targetFormat) {
                case SubtitleFormat.SRT:
                    output = this.toSRT(parsed.entries)
                    break
                case SubtitleFormat.VTT:
                    output = this.toVTT(parsed.entries)
                    break
                case SubtitleFormat.ASS:
                    output = this.toASS(parsed.entries)
                    break
                case SubtitleFormat.SSA:
                    output = this.toSSA(parsed.entries)
                    break
                case SubtitleFormat.SUB:
                    output = this.toSUB(parsed.entries)
                    break
                default:
                    throw new Error(`Unsupported target format: ${targetFormat}`)
            }

            const timeElapsed = Date.now() - startTime

            return {
                success: true,
                output,
                entriesProcessed: parsed.entries.length,
                timeElapsed,
                warnings: this.getConversionWarnings(parsed.format, targetFormat)
            }
        } catch (error) {
            return {
                success: false,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                entriesProcessed: 0,
                timeElapsed: Date.now() - startTime
            }
        }
    }

    /**
     * Convert to SRT format
     */
    private static toSRT(entries: SubtitleEntry[]): string {
        return entries.map((entry) => {
            const startTime = this.formatSRTTime(entry.startTime)
            const endTime = this.formatSRTTime(entry.endTime)

            return `${entry.index}\n${startTime} --> ${endTime}\n${entry.text}\n`
        }).join('\n')
    }

    /**
     * Convert to VTT format
     */
    private static toVTT(entries: SubtitleEntry[]): string {
        const header = 'WEBVTT\n\n'
        const content = entries.map((entry) => {
            const startTime = this.formatVTTTime(entry.startTime)
            const endTime = this.formatVTTTime(entry.endTime)

            return `${startTime} --> ${endTime}\n${entry.text}\n`
        }).join('\n')

        return header + content
    }

    /**
     * Convert to ASS format
     */
    private static toASS(entries: SubtitleEntry[]): string {
        const header = `[Script Info]
Title: Converted Subtitle
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`

        const content = entries.map((entry) => {
            const startTime = this.formatASSTime(entry.startTime)
            const endTime = this.formatASSTime(entry.endTime)
            const text = entry.text.replace(/\n/g, '\\N')

            return `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}`
        }).join('\n')

        return header + content
    }

    /**
     * Convert to SSA format
     */
    private static toSSA(entries: SubtitleEntry[]): string {
        const header = `[Script Info]
Title: Converted Subtitle
ScriptType: v4.00
Collisions: Normal
PlayDepth: 0

[V4 Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
Style: Default,Arial,20,16777215,65535,65535,-2147483640,0,0,1,2,3,2,30,30,30,0,1

[Events]
Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`

        const content = entries.map((entry) => {
            const startTime = this.formatASSTime(entry.startTime)
            const endTime = this.formatASSTime(entry.endTime)
            const text = entry.text.replace(/\n/g, '\\N')

            return `Dialogue: Marked=0,${startTime},${endTime},Default,,0,0,0,,${text}`
        }).join('\n')

        return header + content
    }

    /**
     * Convert to SUB (MicroDVD) format
     */
    private static toSUB(entries: SubtitleEntry[]): string {
        const fps = 25 // Default frame rate

        return entries.map((entry) => {
            const startFrame = Math.floor((entry.startTime / 1000) * fps)
            const endFrame = Math.floor((entry.endTime / 1000) * fps)
            const text = entry.text.replace(/\n/g, '|')

            return `{${startFrame}}{${endFrame}}${text}`
        }).join('\n')
    }

    /**
     * Format time for SRT (00:00:01,000)
     */
    private static formatSRTTime(ms: number): string {
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const milliseconds = ms % 1000

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`
    }

    /**
     * Format time for VTT (00:00:01.000)
     */
    private static formatVTTTime(ms: number): string {
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const milliseconds = ms % 1000

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`
    }

    /**
     * Format time for ASS/SSA (0:00:01.00)
     */
    private static formatASSTime(ms: number): string {
        const hours = Math.floor(ms / 3600000)
        const minutes = Math.floor((ms % 3600000) / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const centiseconds = Math.floor((ms % 1000) / 10)

        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
    }

    /**
     * Get conversion warnings
     */
    private static getConversionWarnings(sourceFormat: SubtitleFormat, targetFormat: SubtitleFormat): string[] {
        const warnings: string[] = []

        // Warn about styling loss when converting from ASS/SSA to simpler formats
        if ((sourceFormat === SubtitleFormat.ASS || sourceFormat === SubtitleFormat.SSA) &&
            (targetFormat === SubtitleFormat.SRT || targetFormat === SubtitleFormat.VTT || targetFormat === SubtitleFormat.SUB)) {
            warnings.push('Advanced styling and positioning from ASS/SSA format may be lost')
        }

        // Warn about potential positioning loss
        if (sourceFormat === SubtitleFormat.VTT && targetFormat === SubtitleFormat.SRT) {
            warnings.push('VTT positioning and styling information will be removed')
        }

        return warnings
    }
}
