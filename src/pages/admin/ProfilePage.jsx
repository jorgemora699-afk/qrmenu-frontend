import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile, uploadImage } from "../../services/api"

function ProfilePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", logo_url: "", banner_url: "", tagline: "",
    primary_color: "#222222", secondary_color: "#ffffff"
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
        primary_color: res.data.primary_color || "#222222",
        secondary_color: res.data.secondary_color || "#ffffff"
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
      setForm((prev) => ({ ...prev, [field]: res.data.url }))
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
      localStorage.setItem("business", JSON.stringify({ ...stored, name: form.name }))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/admin")}>← Volver</button>
          <h2>Perfil del negocio</h2>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {success && <div className="success-msg">✓ Perfil actualizado correctamente</div>}

      <div className="profile-form">
        <div className="form-group">
          <label>Nombre del negocio</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre del negocio"
          />
        </div>

        <div className="form-group">
          <label>Frase o slogan</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="Ej: El mejor café de la ciudad"
          />
        </div>

        <div className="form-group">
          <label>Logo del negocio</label>
          <div className="upload-area">
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo" className="logo-preview" />
            )}
            <label className="upload-btn">
              {uploadingLogo ? "Subiendo..." : form.logo_url ? "Cambiar logo" : "Subir logo"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "logo_url", setUploadingLogo)}
                style={{ display: "none" }}
                disabled={uploadingLogo}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Imagen de fondo del header</label>
          <div className="upload-area">
            {form.banner_url && (
              <img src={form.banner_url} alt="Banner" className="banner-preview" />
            )}
            <label className="upload-btn">
              {uploadingBanner ? "Subiendo..." : form.banner_url ? "Cambiar banner" : "Subir banner"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "banner_url", setUploadingBanner)}
                style={{ display: "none" }}
                disabled={uploadingBanner}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Colores del menú</label>
          <div className="color-row">
            <div className="color-field">
              <span>Color del overlay</span>
              <div className="color-input-wrap">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                />
                <span>{form.primary_color}</span>
              </div>
            </div>
            <div className="color-field">
              <span>Color del texto</span>
              <div className="color-input-wrap">
                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                />
                <span>{form.secondary_color}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Vista previa del header</label>
          <div
            className="menu-preview"
            style={{
              backgroundImage: form.banner_url ? `url(${form.banner_url})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: form.banner_url ? "transparent" : form.primary_color,
              color: form.secondary_color
            }}
          >
            <div
              className="menu-preview-overlay"
              style={{ background: form.banner_url ? `${form.primary_color}99` : "transparent" }}
            >
              {form.logo_url && (
                <img src={form.logo_url} alt="Logo" className="preview-logo" />
              )}
              <h3>{form.name || "Nombre del negocio"}</h3>
              <p>{form.tagline || "Tu slogan aquí"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage