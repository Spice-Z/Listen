type LanguageCode = string;
type LanguageName = string;

export function getLanguageName(code: LanguageCode): LanguageName {
  const lookupTable: Record<LanguageCode, LanguageName> = {
    en: 'English',
    ja: 'Japanese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    zh: 'Chinese',
    ru: 'Russian',
    ko: 'Korean',
    ar: 'Arabic',
    pt: 'Portuguese',
  };
  if (!lookupTable[code]) {
    throw new Error(`Unknown language code: ${code}`);
  }

  return lookupTable[code];
}
