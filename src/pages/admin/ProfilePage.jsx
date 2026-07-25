import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile, uploadImage } from "../../services/api"
import MenuPreview from "../../components/admin/MenuPreview"
import Loading from "../../components/common/Loading"

import { FONT_THEMES, DEFAULT_FONT_KEY } from "../../config/fontThemes"

const DEFAULT_THEME = {
  accent_color: "#9c7a3c",
  background_color: "#f7f4ee",
  text_color: "#1b1812",
  font_key: DEFAULT_FONT_KEY,
}

function ProfilePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    banner_url: "",
    tagline: "",
    accent_color: "#9c7a3c",
    background_color: "#f7f4ee",
    text_color: "#1b1812",
    font_key: "editorial",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getProfile().then((res) => {
      setForm({
        name: res.data.name || "",
        logo_url: res.data.logo_url || "",
        banner_url: res.data.banner_url || "",
        tagline: res.data.tagline || "",
        accent_color: res.data.accent_color || "#9c7a3c",
        background_color: res.data.background_color || "#f7f4ee",
        text_color: res.data.text_color || "#1b1812",
        font_key: res.data.font_key || "editorial",
      })

      setLoading(false)
    })
  }, [])

  const handleUpload = async (e, field, setUploading) => {
    const file = e.target.files[0]

    if (!file) return

    setUploading(true)

    try {
      const res = await uploadImage(file)

      setForm((prev) => ({
        ...prev,
        [field]: res.data.url,
      }))
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    try {
      await updateProfile(form)

      const stored = JSON.parse(localStorage.getItem("business") || "{}")

      localStorage.setItem(
        "business",
        JSON.stringify({
          ...stored,
          name: form.name,
        })
      )

      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleResetTheme = () => {
      setForm((prev) => ({
        ...prev,
        ...DEFAULT_THEME,
      }))
  }

  const isValidHex = (value) => /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)

  const handleHexChange = (field, value) => {
    let hex = value.trim()
    if (hex && !hex.startsWith("#")) hex = `#${hex}`
    setForm({ ...form, [field]: hex })
  }

  if (loading) return <Loading />

  return (
    <div className="admin-page">

      <header className="panel-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>

        <div className="panel-header-top">
          <h2 className="panel-title">Perfil del negocio</h2>
        </div>

        <div className="panel-rule" />
        <p className="panel-hint">Así es como tus clientes ven tu negocio al escanear el QR</p>
      </header>

      {success && (
        <div className="success-msg">
          <span className="success-msg-dot" />
          Perfil actualizado correctamente
        </div>
      )}

      <div className="profile-form">

        <section className="profile-card profile-card-preview">
          <span className="add-card-label">Vista previa</span>
          <MenuPreview
            name={form.name}
            tagline={form.tagline}
            logo_url={form.logo_url}
            banner_url={form.banner_url}
            accent_color={form.accent_color}
            background_color={form.background_color}
            text_color={form.text_color}
            font_key={form.font_key}
          />
        </section>

        <section className="profile-card">
          <span className="add-card-label">Información</span>

          <div className="form-field">
            <label>Nombre del negocio</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Nombre del negocio"
            />
          </div>

          <div className="form-field">
            <label>Slogan</label>
            <input
              value={form.tagline}
              onChange={(e) =>
                setForm({
                  ...form,
                  tagline: e.target.value,
                })
              }
              placeholder="Ej: El mejor café de la ciudad"
            />
          </div>
        </section>

        <section className="profile-card">
          <span className="add-card-label">Imágenes</span>

          <div className="form-field">
            <label>Logo del negocio</label>

            <div className="upload-area">
              {form.logo_url ? (
                <img src={form.logo_url} alt="Logo" className="logo-preview" />
              ) : (
                <span className="logo-preview logo-preview-empty">🍽</span>
              )}

              <label className="upload-btn">
                {uploadingLogo
                  ? "Subiendo..."
                  : form.logo_url
                  ? "Cambiar logo"
                  : "Subir logo"}

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={uploadingLogo}
                  onChange={(e) =>
                    handleUpload(e, "logo_url", setUploadingLogo)
                  }
                />
              </label>
            </div>
          </div>

          <div className="form-field">
            <label>Imagen de fondo</label>

            <div className="upload-area">
              {form.banner_url ? (
                <img src={form.banner_url} alt="Banner" className="banner-preview" />
              ) : (
                <span className="banner-preview banner-preview-empty">🖼</span>
              )}

              <label className="upload-btn">
                {uploadingBanner
                  ? "Subiendo..."
                  : form.banner_url
                  ? "Cambiar banner"
                  : "Subir banner"}

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={uploadingBanner}
                  onChange={(e) =>
                    handleUpload(e, "banner_url", setUploadingBanner)
                  }
                />
              </label>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <span className="add-card-label">Colores</span>

          <div className="color-fields-row">

            <div className="color-field">
              <label>Acento</label>
              <div className={`color-field-input ${!isValidHex(form.accent_color) ? "invalid" : ""}`}>
                <input
                  type="color"
                  value={isValidHex(form.accent_color) ? form.accent_color : "#9c7a3c"}
                  onChange={(e) =>
                    setForm({ ...form, accent_color: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="hex-input"
                  value={form.accent_color}
                  onChange={(e) => handleHexChange("accent_color", e.target.value)}
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="color-field">
              <label>Fondo</label>
              <div className={`color-field-input ${!isValidHex(form.background_color) ? "invalid" : ""}`}>
                <input
                  type="color"
                  value={isValidHex(form.background_color) ? form.background_color : "#f7f4ee"}
                  onChange={(e) =>
                    setForm({ ...form, background_color: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="hex-input"
                  value={form.background_color}
                  onChange={(e) => handleHexChange("background_color", e.target.value)}
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="color-field">
              <label>Texto</label>
              <div className={`color-field-input ${!isValidHex(form.text_color) ? "invalid" : ""}`}>
                <input
                  type="color"
                  value={isValidHex(form.text_color) ? form.text_color : "#1b1812"}
                  onChange={(e) =>
                    setForm({ ...form, text_color: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="hex-input"
                  value={form.text_color}
                  onChange={(e) => handleHexChange("text_color", e.target.value)}
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

          </div>

          <p className="color-hint">Toca el círculo para elegir visualmente, o escribe el código directamente</p>
        </section>

        <section className="profile-card">
          <span className="add-card-label">Tipografía</span>

          <div className="font-picker-grid">
            {Object.entries(FONT_THEMES).map(([key, font]) => (
              <button
                key={key}
                type="button"
                className={`font-picker-card ${form.font_key === key ? "selected" : ""}`}
                onClick={() => setForm({ ...form, font_key: key })}
              >
                <span
                  className="font-picker-sample"
                  style={{ fontFamily: font.display }}
                >
                  Aa
                </span>
                <span className="font-picker-label">{font.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="reset-theme-btn"
            onClick={handleResetTheme}
          >
            Restaurar colores y tipografía por defecto
          </button>
        </section>

        <button
          className="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

      </div>

    </div>
  )
}

export default ProfilePage