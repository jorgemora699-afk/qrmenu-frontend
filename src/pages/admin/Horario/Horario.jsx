import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  verificarPinHorario,
  listarEmpleadosHorario,
  obtenerEstadoTurno,
  marcarEntradaHorario,
  marcarSalidaHorario,
} from "../../../services/api"
import "./Horario.css"

/* ---------- iconos (mismo trazo fino que el resto del admin) ---------- */

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconClock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const IconLogIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
)

const IconLogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function formatearHora(isoString) {
  if (!isoString) return "—"
  return new Date(isoString).toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  })
}

/* ---------- variantes de animación ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}

export default function Horario() {
  const navigate = useNavigate()
  const slug = JSON.parse(localStorage.getItem("business") || "{}").slug

  const [token, setToken] = useState(null)
  const [pin, setPin] = useState("")
  const [verificando, setVerificando] = useState(false)

  const [empleados, setEmpleados] = useState([])
  const [empleadoId, setEmpleadoId] = useState("")
  const [turnoAbierto, setTurnoAbierto] = useState(null)

  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) cargarEmpleados()
  }, [token])

  useEffect(() => {
    if (token && empleadoId) {
      cargarEstado(empleadoId)
    } else {
      setTurnoAbierto(null)
    }
  }, [empleadoId])

  async function handleVerificarPin(e) {
    e.preventDefault()
    setError(null)
    setVerificando(true)
    try {
      const res = await verificarPinHorario(slug, pin)
      setToken(res.data.access_token)
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo verificar el PIN")
    } finally {
      setVerificando(false)
    }
  }

  async function cargarEmpleados() {
    try {
      const res = await listarEmpleadosHorario(token)
      setEmpleados(res.data)
    } catch (err) {
      setError("No se pudieron cargar los empleados")
    }
  }

  async function cargarEstado(id) {
    try {
      const res = await obtenerEstadoTurno(token, id)
      setTurnoAbierto(res.data.turno_abierto)
    } catch (err) {
      setError("No se pudo consultar el estado del turno")
    }
  }

  async function handleEntrada() {
    if (!empleadoId) {
      setError("Selecciona quién eres primero")
      return
    }
    setEnviando(true)
    setError(null)
    setMensaje(null)
    try {
      await marcarEntradaHorario(token, empleadoId)
      setMensaje("Entrada registrada")
      cargarEstado(empleadoId)
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo marcar la entrada")
    } finally {
      setEnviando(false)
    }
  }

  async function handleSalida() {
    if (!empleadoId) {
      setError("Selecciona quién eres primero")
      return
    }
    setEnviando(true)
    setError(null)
    setMensaje(null)
    try {
      await marcarSalidaHorario(token, empleadoId)
      setMensaje("Salida registrada")
      cargarEstado(empleadoId)
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo marcar la salida")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="admin-page">
      <button className="back-btn" onClick={() => navigate("/admin")}>
        <IconArrowLeft />
        Volver
      </button>

      <AnimatePresence mode="wait">
        {!token ? (
          /* ---------- pantalla de PIN ---------- */
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hor-pin-screen"
          >
            <motion.div
              className="hor-pin-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <motion.span
                className="hor-pin-icon"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
              >
                <IconClock />
              </motion.span>
              <span className="login-eyebrow">Registro de horario</span>
              <h2>Ingresa el PIN</h2>
              <div className="login-rule" />
              <p>Pídele el PIN al encargado si no lo tienes</p>

              <form onSubmit={handleVerificarPin} className="hor-pin-form">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  className="pin-input"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="error-msg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  type="submit"
                  className="save-profile-btn"
                  disabled={verificando || pin.length !== 4}
                  whileTap={{ scale: 0.97 }}
                >
                  {verificando ? "Verificando..." : "Ingresar"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          /* ---------- pantalla de marcar horario ---------- */
          <motion.div
            key="horario"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div className="panel-header" initial="hidden" animate="show" variants={fadeUp}>
              <div className="panel-header-top">
                <h1 className="panel-title">Horario</h1>
              </div>
              <div className="panel-rule" />
              <p className="panel-hint">Marca tu entrada y salida del turno</p>
            </motion.div>

            <motion.div className="form-field" initial="hidden" animate="show" variants={fadeUp}>
              <label>¿Quién eres?</label>
              <select
                className="filter-select"
                value={empleadoId}
                onChange={(e) => {
                  setEmpleadoId(e.target.value)
                  setMensaje(null)
                  setError(null)
                }}
              >
                <option value="">Selecciona...</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {mensaje && (
                <motion.div
                  key="mensaje"
                  className="success-msg"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <span className="success-msg-dot" />{mensaje}
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  className="error-msg"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {empleadoId && (
                <motion.div
                  key={`${empleadoId}-${turnoAbierto ? "activo" : "libre"}`}
                  className={`hor-estado ${turnoAbierto ? "hor-estado-activo" : ""}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconClock />
                  {turnoAbierto
                    ? `Turno en curso desde las ${formatearHora(turnoAbierto.hora_entrada)}`
                    : "No hay ningún turno abierto"}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hor-botones">
              <motion.button
                className="hor-btn-entrada"
                onClick={handleEntrada}
                disabled={enviando || !empleadoId || !!turnoAbierto}
                whileTap={{ scale: 0.97 }}
              >
                <IconLogIn />
                Marcar entrada
              </motion.button>
              <motion.button
                className="hor-btn-salida"
                onClick={handleSalida}
                disabled={enviando || !empleadoId || !turnoAbierto}
                whileTap={{ scale: 0.97 }}
              >
                <IconLogOut />
                Marcar salida
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}