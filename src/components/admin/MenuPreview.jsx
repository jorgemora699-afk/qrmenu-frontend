import { buildThemeVars } from "../../utils/theme"

function MenuPreview({ name, tagline, logo_url, banner_url, accent_color, background_color, text_color, font_key }) {
  const themeVars = buildThemeVars({ accent_color, background_color, text_color, font_key })

  return (
    <div
      className={`menu-preview ${banner_url ? "" : "menu-preview-noimg"}`}
      style={{
        backgroundImage: banner_url ? `url(${banner_url})` : "none",
        ...themeVars,
      }}
    >
      <div className="menu-preview-overlay">

        {logo_url && (
          <img
            src={logo_url}
            alt="Logo"
            className="preview-logo"
          />
        )}

        <h3 style={{ fontFamily: "var(--font-display)" }}>
          {name || "Nombre del negocio"}
        </h3>

        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
          {tagline || "Tu slogan aquí"}
        </p>

      </div>
    </div>
  )
}

export default MenuPreview