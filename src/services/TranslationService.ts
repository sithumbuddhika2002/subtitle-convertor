import { Language, SubtitleEntry, ParsedSubtitle, TranslationResult } from '../types/subtitle'

// Local Python translation server (free, no API key needed)
const TRANSLATION_API_URL = 'http://localhost:5000/translate'
const DETECTION_API_URL = 'http://localhost:5000/detect'

export class TranslationService {
    /**
     * Translate subtitle entries from source language to target language
     */
    static async translateSubtitle(
        parsedSubtitle: ParsedSubtitle,
        sourceLanguage: Language,
        targetLanguage: Language,
        onProgress?: (current: number, total: number) => void
    ): Promise<TranslationResult> {
        const startTime = Date.now()

        try {
            // Validate inputs
            if (!parsedSubtitle || !parsedSubtitle.entries || parsedSubtitle.entries.length === 0) {
                return {
                    success: false,
                    errors: ['No subtitle entries to translate'],
                    entriesProcessed: 0,
                    timeElapsed: Date.now() - startTime,
                }
            }

            if (targetLanguage === Language.AUTO_DETECT) {
                return {
                    success: false,
                    errors: ['Please select a target language'],
                    entriesProcessed: 0,
                    timeElapsed: Date.now() - startTime,
                }
            }

            // Extract all text entries for batch translation
            const textEntries = parsedSubtitle.entries.map(entry => entry.text)

            // Translate in batches to avoid overwhelming the API
            const batchSize = 10 // Reduced batch size for better reliability
            const translatedEntries: SubtitleEntry[] = []
            let detectedLang: Language | undefined

            for (let i = 0; i < parsedSubtitle.entries.length; i += batchSize) {
                const batch = textEntries.slice(i, i + batchSize)
                const batchOriginalEntries = parsedSubtitle.entries.slice(i, i + batchSize)

                const translatedBatch = await this.translateBatch(
                    batch,
                    sourceLanguage,
                    targetLanguage
                )

                // If auto-detect, capture detected language from first batch
                if (i === 0 && translatedBatch.detectedLanguage) {
                    detectedLang = translatedBatch.detectedLanguage
                }

                // Create new subtitle entries with translated text
                for (let j = 0; j < batchOriginalEntries.length; j++) {
                    const original = batchOriginalEntries[j]
                    translatedEntries.push({
                        ...original,
                        text: translatedBatch.translations[j] || original.text,
                    })
                }

                // Report progress
                if (onProgress) {
                    onProgress(translatedEntries.length, parsedSubtitle.entries.length)
                }

                // Add small delay between batches to avoid rate limiting
                if (i + batchSize < parsedSubtitle.entries.length) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                }
            }

            const translatedSubtitle: ParsedSubtitle = {
                format: parsedSubtitle.format,
                entries: translatedEntries,
                metadata: parsedSubtitle.metadata,
            }

            return {
                success: true,
                translatedSubtitle,
                detectedLanguage: detectedLang,
                entriesProcessed: translatedEntries.length,
                timeElapsed: Date.now() - startTime,
            }
        } catch (error) {
            console.error('Translation error:', error)
            return {
                success: false,
                errors: [error instanceof Error ? error.message : 'Unknown translation error'],
                entriesProcessed: 0,
                timeElapsed: Date.now() - startTime,
            }
        }
    }

    /**
     * Translate a batch of text entries
     */
    private static async translateBatch(
        texts: string[],
        sourceLanguage: Language,
        targetLanguage: Language
    ): Promise<{ translations: string[]; detectedLanguage?: Language }> {
        const translations: string[] = []
        let detectedLanguage: Language | undefined

        // Translate each text individually
        for (const text of texts) {
            // Skip empty text
            if (!text || text.trim() === '') {
                translations.push(text)
                continue
            }

            try {
                const requestBody = {
                    q: text,
                    source: sourceLanguage === Language.AUTO_DETECT ? 'auto' : sourceLanguage,
                    target: targetLanguage,
                    format: 'text'
                }

                const response = await fetch(TRANSLATION_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                })

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('Translation API error:', response.status, errorText)
                    throw new Error(`Translation API error: ${response.status}`)
                }

                const data = await response.json()

                // Capture detected language from first request
                if (!detectedLanguage && data.detectedLanguage) {
                    const langCode = data.detectedLanguage.language || data.detectedLanguage
                    detectedLanguage = this.mapLanguageCode(langCode)
                }

                translations.push(data.translatedText || text)

                // Small delay between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100))
            } catch (error) {
                console.error('Error translating text:', text.substring(0, 50), error)
                // On error, keep original text
                translations.push(text)
            }
        }

        return { translations, detectedLanguage }
    }

    /**
     * Map language code from API response to our Language enum
     */
    private static mapLanguageCode(code: string): Language {
        const mapping: Record<string, Language> = {
            'si': Language.SINHALA,
            'en': Language.ENGLISH,
            'es': Language.SPANISH,
            'fr': Language.FRENCH,
            'de': Language.GERMAN,
            'it': Language.ITALIAN,
            'pt': Language.PORTUGUESE,
            'ru': Language.RUSSIAN,
            'ja': Language.JAPANESE,
            'ko': Language.KOREAN,
            'zh': Language.CHINESE_SIMPLIFIED,
            'zt': Language.CHINESE_TRADITIONAL,
            'ar': Language.ARABIC,
            'hi': Language.HINDI,
            'bn': Language.BENGALI,
            'ta': Language.TAMIL,
            'te': Language.TELUGU,
            'tr': Language.TURKISH,
            'nl': Language.DUTCH,
            'pl': Language.POLISH,
            'uk': Language.UKRAINIAN,
            'vi': Language.VIETNAMESE,
            'th': Language.THAI,
            'id': Language.INDONESIAN,
            'ms': Language.MALAY,
            'fa': Language.PERSIAN,
            'he': Language.HEBREW,
            'el': Language.GREEK,
            'sv': Language.SWEDISH,
            'no': Language.NORWEGIAN,
            'da': Language.DANISH,
            'fi': Language.FINNISH,
        }

        return mapping[code] || Language.ENGLISH
    }

    /**
     * Detect language of text (optional, non-blocking)
     */
    static async detectLanguage(text: string): Promise<Language> {
        try {
            // Skip detection for empty text
            if (!text || text.trim() === '') {
                return Language.ENGLISH
            }

            const response = await fetch(DETECTION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text.substring(0, 500) // Limit text length for detection
                }),
            })

            if (!response.ok) {
                console.warn('Language detection failed, using default')
                return Language.ENGLISH
            }

            const data = await response.json()
            if (data && data.length > 0) {
                return this.mapLanguageCode(data[0].language)
            }

            return Language.ENGLISH
        } catch (error) {
            console.warn('Language detection error:', error)
            // Return default language instead of throwing
            return Language.ENGLISH
        }
    }
}
