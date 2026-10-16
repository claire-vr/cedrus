/** True when the text contains Arabic script (letters, digits or vowel signs). */
export function isArabic(text: string) {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}
