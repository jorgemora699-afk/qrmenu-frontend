import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/api"
import axios from "axios"

const BASE_URL = "https://menunegocio-production.up.railway.app"

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.09 2.7A9.12 9.12 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.22-5.94" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", slug: "", email: "", password: "", confirm: "", invite_code: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSlug = (value) => {
    const slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    setForm({ ...form, slug })
  }

  const handleRegister = async () => {
    setError("")
    if (!form.name || !form.slug || !form.email || !form.password || !form.invite_code) {
      setError("Completa todos los campos")
      return
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: form.name,
        slug: form.slug,
        email: form.email,
        password: form.password,
        invite_code: form.invite_code.trim().toUpperCase()
      })
      const res = await login(form.email, form.password)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("business", JSON.stringify(res.data.business))
      navigate("/admin")
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">

        <span className="login-eyebrow">Crear cuenta</span>
        <h2>Registra tu negocio</h2>
        <div className="login-rule" />
        <p>Tu menú digital, listo en minutos</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          placeholder="Nombre del negocio"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="slug-field">
          <input
            placeholder="URL de tu menú (ej: mi-cafe)"
            value={form.slug}
            onChange={(e) => handleSlug(e.target.value)}
          />
          <span className="slug-preview">
            {form.slug ? `/${form.slug}` : "/tu-negocio"}
          </span>
        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>

        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {showConfirm ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>

        <div className="invite-field">
          <input
            placeholder="Código de invitación"
            value={form.invite_code}
            onChange={(e) => setForm({ ...form, invite_code: e.target.value.toUpperCase() })}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          <span className="invite-hint">Te lo compartimos por WhatsApp al confirmar tu registro</span>
        </div>

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/admin/login")}>Inicia sesión</span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage