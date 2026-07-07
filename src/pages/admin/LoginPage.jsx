import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../services/api"

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
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