// TypeScript types for subtitle application

export enum SubtitleFormat {
    SRT = 'srt',
    VTT = 'vtt',
    ASS = 'ass',
    SSA = 'ssa',
    SUB = 'sub',
}

export enum Language {
    AUTO_DETECT = 'auto',
    SINHALA = 'si',
    ENGLISH = 'en',
    SPANISH = 'es',
    FRENCH = 'fr',
    GERMAN = 'de',
    ITALIAN = 'it',
    PORTUGUESE = 'pt',
    RUSSIAN = 'ru',
    JAPANESE = 'ja',
    KOREAN = 'ko',
    CHINESE_SIMPLIFIED = 'zh',
    CHINESE_TRADITIONAL = 'zt',
    ARABIC = 'ar',
    HINDI = 'hi',
    BENGALI = 'bn',
    TAMIL = 'ta',
    TELUGU = 'te',
    TURKISH = 'tr',
    DUTCH = 'nl',
    POLISH = 'pl',
    UKRAINIAN = 'uk',
    VIETNAMESE = 'vi',
    THAI = 'th',
    INDONESIAN = 'id',
    MALAY = 'ms',
    PERSIAN = 'fa',
    HEBREW = 'he',
    GREEK = 'el',
    SWEDISH = 'sv',
    NORWEGIAN = 'no',
    DANISH = 'da',
    FINNISH = 'fi',
}

export const LanguageNames: Record<Language, string> = {
    [Language.AUTO_DETECT]: 'Auto Detect',
    [Language.SINHALA]: 'Sinhala (සිංහල)',
    [Language.ENGLISH]: 'English',
    [Language.SPANISH]: 'Spanish (Español)',
    [Language.FRENCH]: 'French (Français)',
    [Language.GERMAN]: 'German (Deutsch)',
    [Language.ITALIAN]: 'Italian (Italiano)',
    [Language.PORTUGUESE]: 'Portuguese (Português)',
    [Language.RUSSIAN]: 'Russian (Русский)',
    [Language.JAPANESE]: 'Japanese (日本語)',
    [Language.KOREAN]: 'Korean (한국어)',
    [Language.CHINESE_SIMPLIFIED]: 'Chinese Simplified (简体中文)',
    [Language.CHINESE_TRADITIONAL]: 'Chinese Traditional (繁體中文)',
    [Language.ARABIC]: 'Arabic (العربية)',
    [Language.HINDI]: 'Hindi (हिन्दी)',
    [Language.BENGALI]: 'Bengali (বাংলা)',
    [Language.TAMIL]: 'Tamil (தமிழ்)',
    [Language.TELUGU]: 'Telugu (తెలుగు)',
    [Language.TURKISH]: 'Turkish (Türkçe)',
    [Language.DUTCH]: 'Dutch (Nederlands)',
    [Language.POLISH]: 'Polish (Polski)',
    [Language.UKRAINIAN]: 'Ukrainian (Українська)',
    [Language.VIETNAMESE]: 'Vietnamese (Tiếng Việt)',
    [Language.THAI]: 'Thai (ไทย)',
    [Language.INDONESIAN]: 'Indonesian (Bahasa Indonesia)',
    [Language.MALAY]: 'Malay (Bahasa Melayu)',
    [Language.PERSIAN]: 'Persian (فارسی)',
    [Language.HEBREW]: 'Hebrew (עברית)',
    [Language.GREEK]: 'Greek (Ελληνικά)',
    [Language.SWEDISH]: 'Swedish (Svenska)',
    [Language.NORWEGIAN]: 'Norwegian (Norsk)',
    [Language.DANISH]: 'Danish (Dansk)',
    [Language.FINNISH]: 'Finnish (Suomi)',
}

export interface SubtitleEntry {
    index: number
    startTime: number // milliseconds
    endTime: number // milliseconds
    text: string
    styling?: {
        fontName?: string
        fontSize?: number
        color?: string
        bold?: boolean
        italic?: boolean
        underline?: boolean
    }
}

export interface ParsedSubtitle {
    format: SubtitleFormat
    entries: SubtitleEntry[]
    metadata?: {
        title?: string
        author?: string
        [key: string]: any
    }
}

export interface ConversionOptions {
    preserveStyling: boolean
    encoding: string
    targetFormat: SubtitleFormat
}

export interface TranslationOptions {
    sourceLanguage: Language
    targetLanguage: Language
    preserveFormatting: boolean
}

export interface FileMetadata {
    name: string
    path: string
    size: number
    encoding: string
}

export enum EncodingType {
    UTF8 = 'utf-8',
    UTF16 = 'utf-16',
    ASCII = 'ascii',
    ISO88591 = 'iso-8859-1',
}

export interface ConversionResult {
    success: boolean
    output?: string
    errors?: string[]
    warnings?: string[]
    entriesProcessed: number
    timeElapsed: number
}

export interface TranslationResult {
    success: boolean
    translatedSubtitle?: ParsedSubtitle
    output?: string
    detectedLanguage?: Language
    errors?: string[]
    warnings?: string[]
    entriesProcessed: number
    timeElapsed: number
}

