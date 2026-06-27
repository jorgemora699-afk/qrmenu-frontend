function MenuPreview({ name, tagline, logo_url, banner_url }) {
  return (
    <div
      className={`menu-preview ${banner_url ? "" : "menu-preview-noimg"}`}
      style={{
        backgroundImage: banner_url ? `url(${banner_url})` : "none",
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

        <h3>
          {name || "Nombre del negocio"}
        </h3>

        <p>
          {tagline || "Tu slogan aquí"}
        </p>

      </div>
    </div>
  )
}

export default MenuPreview