import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../services/api"

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

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await login(email, password)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("business", JSON.stringify(res.data.business))
      navigate("/admin")
    } catch {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">

        <span className="login-eyebrow">Panel Admin</span>
        <h2>Bienvenido de nuevo</h2>
        <div className="login-rule" />
        <p>Ingresa a tu cuenta para administrar tu menú</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="login-link">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")}>Regístrate gratis</span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage