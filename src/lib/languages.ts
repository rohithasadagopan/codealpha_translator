export interface Language {
  code: string;
  name: string;
  /** BCP-47 voice hint for speech synthesis */
  speech: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", speech: "en-US" },
  { code: "es", name: "Spanish", speech: "es-ES" },
  { code: "fr", name: "French", speech: "fr-FR" },
  { code: "de", name: "German", speech: "de-DE" },
  { code: "it", name: "Italian", speech: "it-IT" },
  { code: "pt", name: "Portuguese", speech: "pt-PT" },
  { code: "ru", name: "Russian", speech: "ru-RU" },
  { code: "zh-CN", name: "Chinese (Simplified)", speech: "zh-CN" },
  { code: "ja", name: "Japanese", speech: "ja-JP" },
  { code: "ko", name: "Korean", speech: "ko-KR" },
  { code: "ar", name: "Arabic", speech: "ar-SA" },
  { code: "hi", name: "Hindi", speech: "hi-IN" },
  { code: "bn", name: "Bengali", speech: "bn-IN" },
  { code: "ta", name: "Tamil", speech: "ta-IN" },
  { code: "te", name: "Telugu", speech: "te-IN" },
  { code: "mr", name: "Marathi", speech: "mr-IN" },
  { code: "ur", name: "Urdu", speech: "ur-PK" },
  { code: "tr", name: "Turkish", speech: "tr-TR" },
  { code: "nl", name: "Dutch", speech: "nl-NL" },
  { code: "pl", name: "Polish", speech: "pl-PL" },
  { code: "sv", name: "Swedish", speech: "sv-SE" },
  { code: "id", name: "Indonesian", speech: "id-ID" },
  { code: "th", name: "Thai", speech: "th-TH" },
  { code: "vi", name: "Vietnamese", speech: "vi-VN" },
  { code: "el", name: "Greek", speech: "el-GR" },
  { code: "he", name: "Hebrew", speech: "he-IL" },
  { code: "uk", name: "Ukrainian", speech: "uk-UA" },
  { code: "cs", name: "Czech", speech: "cs-CZ" },
];

export function languageName(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export function speechCode(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.speech ?? code;
}
