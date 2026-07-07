import { FONT_THEMES, DEFAULT_FONT_KEY } from "../config/fontThemes"

export function buildThemeVars(business) {
  const accent = business?.accent_color || "#9c7a3c"
  const background = business?.background_color || "#f7f4ee"
  const text = business?.text_color || "#1b1812"
  const fontKey = business?.font_key || DEFAULT_FONT_KEY
  const font = FONT_THEMES[fontKey] || FONT_THEMES[DEFAULT_FONT_KEY]

  return {
    "--rd-ink": text,
    "--rd-paper": background,
    "--rd-brass": accent,
    "--rd-brass-deep": `color-mix(in srgb, ${accent} 65%, black)`,
    "--rd-brass-soft": `color-mix(in srgb, ${accent} 16%, ${background})`,
    "--rd-muted": `color-mix(in srgb, ${text} 55%, ${background})`,
    "--rd-line": `color-mix(in srgb, ${accent} 22%, ${background})`,
    "--rd-surface": `color-mix(in srgb, ${background} 25%, white)`,
    "--font-display": font.display,
    "--font-body": font.body,
  }
}