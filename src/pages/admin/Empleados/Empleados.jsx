import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  calcularSalariosEmpleados,
  listarTurnosEmpleado,
  actualizarTurno,
  generarPdfEmpleado,
  generarReporteGeneralPdf,
} from "../../../services/api"
import "./Empleados.css"

/* ---------- iconos (mismo trazo fino que el resto del admin) ---------- */

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconPencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
)

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const IconChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconClockSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

/* ---------- helpers de formato ---------- */

function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("")
}

function toISODate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function calcularSemana() {
  const hoy = new Date()
  const diaSemana = hoy.getDay()
  const offset = diaSemana === 0 ? 6 : diaSemana - 1
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - offset)
  return [toISODate(lunes), toISODate(hoy)]
}

function calcularQuincena() {
  const hoy = new Date()
  const dia = hoy.getDate()
  const inicio = dia <= 15
    ? new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    : new Date(hoy.getFullYear(), hoy.getMonth(), 16)
  return [toISODate(inicio), toISODate(hoy)]
}

function calcularMes() {
  const hoy = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  return [toISODate(inicio), toISODate(hoy)]
}

const PERIODOS = [
  { valor: "semana", label: "Semana", calcular: calcularSemana },
  { valor: "quincena", label: "Quincena", calcular: calcularQuincena },
  { valor: "mes", label: "Mes", calcular: calcularMes },
  { valor: "personalizado", label: "Otro", calcular: null },
]

function formatearMoneda(valor) {
  return `$${Number(valor).toLocaleString("es-CO")}`
}

function formatearFechaCorta(fechaString) {
  const [, mes, dia] = fechaString.split("-")
  return `${dia}/${mes}`
}

function formatearHora(isoString) {
  if (!isoString) return "—"
  return new Date(isoString).toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function isoAHoraInput(isoString) {
  if (!isoString) return ""
  const d = new Date(isoString)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function formatearRangoPeriodo(desde, hasta) {
  const [, am, ad] = desde.split("-").map(Number)
  const [, bm, bd] = hasta.split("-").map(Number)

  if (desde === hasta) return `${ad} ${MESES_CORTOS[am - 1]}`
  if (am === bm) return `${ad}–${bd} ${MESES_CORTOS[bm - 1]}`
  return `${ad} ${MESES_CORTOS[am - 1]} – ${bd} ${MESES_CORTOS[bm - 1]}`
}

/* ---------- variantes de animación reutilizables ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}

const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
}

export default function Empleados() {
  const navigate = useNavigate()

  const [empleados, setEmpleados] = useState([])
  const [cargandoEmpleados, setCargandoEmpleados] = useState(true)

  const [creando, setCreando] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [nombreForm, setNombreForm] = useState("")
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null)

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const [periodoTipo, setPeriodoTipo] = useState("semana")
  const [desde, setDesde] = useState(() => calcularSemana()[0])
  const [hasta, setHasta] = useState(() => calcularSemana()[1])
  const [salarios, setSalarios] = useState(null)
  const [cargandoSalarios, setCargandoSalarios] = useState(false)

  const [expandidoId, setExpandidoId] = useState(null)
  const [detallePorId, setDetallePorId] = useState({})
  const [cargandoDetalle, setCargandoDetalle] = useState(false)

  const [editandoTurnoId, setEditandoTurnoId] = useState(null)
  const [formTurno, setFormTurno] = useState({ hora_entrada: "", hora_salida: "" })

  const [generandoPdfId, setGenerandoPdfId] = useState(null)
  const [generandoReporte, setGenerandoReporte] = useState(false)

  useEffect(() => {
    cargarEmpleados()
  }, [])

  useEffect(() => {
    cargarSalarios()
    setExpandidoId(null)
    setDetallePorId({})
    setEditandoTurnoId(null)
  }, [desde, hasta])

  async function cargarEmpleados() {
    setCargandoEmpleados(true)
    try {
      const res = await getEmpleados()
      setEmpleados(res.data)
    } catch (err) {
      setError("No se pudieron cargar los empleados")
    } finally {
      setCargandoEmpleados(false)
    }
  }

  async function cargarSalarios() {
    setCargandoSalarios(true)
    try {
      const res = await calcularSalariosEmpleados(desde, hasta)
      setSalarios(res.data)
    } catch (err) {
      setError("No se pudieron calcular los salarios")
    } finally {
      setCargandoSalarios(false)
    }
  }

  async function recargarDetalle(empleadoId) {
    try {
      const res = await listarTurnosEmpleado(empleadoId, desde, hasta)
      setDetallePorId((prev) => ({ ...prev, [empleadoId]: res.data }))
    } catch (err) {
      setError("No se pudo cargar el detalle de horario")
    }
  }

  async function toggleDetalle(empleadoId) {
    if (expandidoId === empleadoId) {
      setExpandidoId(null)
      setEditandoTurnoId(null)
      return
    }
    setExpandidoId(empleadoId)
    setEditandoTurnoId(null)

    if (!detallePorId[empleadoId]) {
      setCargandoDetalle(true)
      await recargarDetalle(empleadoId)
      setCargandoDetalle(false)
    }
  }

  function cambiarPeriodo(tipo) {
    setPeriodoTipo(tipo)
    const periodo = PERIODOS.find((p) => p.valor === tipo)
    if (periodo.calcular) {
      const [d, h] = periodo.calcular()
      setDesde(d)
      setHasta(h)
    }
  }

  function iniciarCreacion() {
    setCreando(true)
    setEditandoId(null)
    setNombreForm("")
    setMensaje(null)
    setError(null)
  }

  function iniciarEdicion(empleado) {
    setEditandoId(empleado.id)
    setCreando(false)
    setNombreForm(empleado.nombre)
    setMensaje(null)
    setError(null)
  }

  function cancelar() {
    setCreando(false)
    setEditandoId(null)
    setNombreForm("")
  }

  async function guardar() {
    if (!nombreForm.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    setGuardando(true)
    setError(null)

    try {
      if (editandoId) {
        await updateEmpleado(editandoId, { nombre: nombreForm })
        setMensaje("Empleado actualizado")
      } else {
        await createEmpleado({ nombre: nombreForm })
        setMensaje("Empleado creado")
      }
      cancelar()
      cargarEmpleados()
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el empleado")
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminar(empleadoId) {
    setGuardando(true)
    setError(null)
    try {
      await deleteEmpleado(empleadoId)
      setMensaje("Empleado desactivado")
      setConfirmandoEliminar(null)
      cargarEmpleados()
      cargarSalarios()
    } catch (err) {
      setError("No se pudo desactivar el empleado")
    } finally {
      setGuardando(false)
    }
  }

  function iniciarEdicionTurno(turno) {
    setEditandoTurnoId(turno.id)
    setFormTurno({
      hora_entrada: isoAHoraInput(turno.hora_entrada),
      hora_salida: isoAHoraInput(turno.hora_salida),
    })
    setError(null)
  }

  function cancelarEdicionTurno() {
    setEditandoTurnoId(null)
    setFormTurno({ hora_entrada: "", hora_salida: "" })
  }

  async function guardarTurno(turnoId, empleadoId) {
    setGuardando(true)
    setError(null)

    const payload = {}
    if (formTurno.hora_entrada) payload.hora_entrada = formTurno.hora_entrada
    if (formTurno.hora_salida) payload.hora_salida = formTurno.hora_salida

    try {
      await actualizarTurno(turnoId, payload)
      await recargarDetalle(empleadoId)
      setEditandoTurnoId(null)
      cargarSalarios()
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo actualizar el turno")
    } finally {
      setGuardando(false)
    }
  }

  async function descargarPdf(empleadoId, empleadoNombre) {
    setGenerandoPdfId(empleadoId)
    setError(null)
    try {
      const res = await generarPdfEmpleado(empleadoId, desde, hasta)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = url
      link.download = `salario_${empleadoNombre.replace(/\s+/g, "_")}_${desde}_${hasta}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError("No se pudo generar el PDF")
    } finally {
      setGenerandoPdfId(null)
    }
  }

  async function descargarReporteGeneral() {
    setGenerandoReporte(true)
    setError(null)
    try {
      const res = await generarReporteGeneralPdf(desde, hasta)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = url
      link.download = `reporte_nomina_${desde}_${hasta}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError("No se pudo generar el reporte")
    } finally {
      setGenerandoReporte(false)
    }
  }

  const formularioAbierto = creando || editandoId !== null
  const empleadosActivos = empleados.filter((e) => e.activo)
  const periodoKey = periodoTipo === "personalizado" ? `personalizado-${desde}-${hasta}` : periodoTipo

  return (
    <div className="admin-page">
      <button className="back-btn" onClick={() => navigate("/admin")}>
        <IconArrowLeft />
        Volver
      </button>

      <motion.div className="panel-header" initial="hidden" animate="show" variants={fadeUp}>
        <div className="panel-header-top">
          <h1 className="panel-title">Empleados</h1>
        </div>
        <div className="panel-rule" />
        <p className="panel-hint">Gestiona tu equipo y calcula el salario a pagar</p>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {mensaje && (
          <motion.div
            key="mensaje"
            className="success-msg"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="success-msg-dot" />{mensaje}
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error"
            className="error-msg"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- resumen destacado ---------- */}

      <motion.div
        className="emp-stats-row"
        initial="hidden"
        animate="show"
        variants={listContainer}
      >
        <motion.div className="emp-stat-card" variants={listItem}>
          <span className="emp-stat-icon emp-stat-icon-slate"><IconUsers /></span>
          <div className="emp-stat-body">
            <span className="emp-stat-eyebrow">{empleadosActivos.length === 1 ? "Empleado activo" : "Empleados activos"}</span>
            <span className="emp-stat-value">{empleadosActivos.length}</span>
          </div>
        </motion.div>

        <motion.div className="emp-stat-card emp-stat-card-brass" variants={listItem}>
          <span className="emp-stat-icon emp-stat-icon-brass"><IconWallet /></span>
          <div className="emp-stat-body">
            <span className="emp-stat-eyebrow">Total a pagar</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${periodoKey}-${salarios ? salarios.total_general : "cargando"}`}
                className="emp-stat-value"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                {salarios ? formatearMoneda(salarios.total_general) : "—"}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={periodoKey}
                className="emp-stat-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {formatearRangoPeriodo(desde, hasta)}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------- sección: equipo ---------- */}

      <motion.div className="profile-card emp-card" initial="hidden" animate="show" variants={fadeUp}>
        <div className="emp-card-header">
          <h2 className="section-title emp-section-title">Equipo</h2>
          {!formularioAbierto && (
            <motion.button
              className="emp-btn-add-inline"
              onClick={iniciarCreacion}
              whileTap={{ scale: 0.95 }}
            >
              <IconPlus />
              Nuevo
            </motion.button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {formularioAbierto && (
            <motion.div
              className="add-card emp-inline-form"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <span className="add-card-label">{editandoId ? "Editar empleado" : "Nuevo empleado"}</span>
              <div className="add-card-row">
                <input
                  type="text"
                  value={nombreForm}
                  onChange={(e) => setNombreForm(e.target.value)}
                  placeholder="Ej: María Pérez"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && guardar()}
                />
              </div>
              <div className="ledger-edit-actions">
                <button className="btn-cancel" onClick={cancelar} disabled={guardando}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={guardar} disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!formularioAbierto && (
          cargandoEmpleados ? (
            <p className="panel-hint emp-loading-text">Cargando...</p>
          ) : empleadosActivos.length === 0 ? (
            <div className="empty-state">Todavía no hay empleados registrados</div>
          ) : (
            <motion.ul className="emp-lista-limpia" initial="hidden" animate="show" variants={listContainer}>
              <AnimatePresence>
                {empleadosActivos.map((emp) => (
                  <motion.li
                    key={emp.id}
                    className="emp-fila"
                    variants={listItem}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    layout
                  >
                    <span className="emp-avatar">{iniciales(emp.nombre)}</span>

                    <div className="emp-fila-info">
                      <span className="emp-fila-nombre">{emp.nombre}</span>
                    </div>

                    {confirmandoEliminar === emp.id ? (
                      <div className="ledger-actions">
                        <button className="btn-cancel" onClick={() => setConfirmandoEliminar(null)} disabled={guardando}>
                          No
                        </button>
                        <button className="btn-delete" onClick={() => confirmarEliminar(emp.id)} disabled={guardando}>
                          Sí, desactivar
                        </button>
                      </div>
                    ) : (
                      <div className="ledger-actions">
                        <motion.button className="icon-btn" onClick={() => iniciarEdicion(emp)} whileTap={{ scale: 0.9 }}>
                          <IconPencil />
                        </motion.button>
                        <motion.button className="icon-btn icon-btn-danger" onClick={() => setConfirmandoEliminar(emp.id)} whileTap={{ scale: 0.9 }}>
                          <IconTrash />
                        </motion.button>
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )
        )}
      </motion.div>

      {/* ---------- sección: salarios ---------- */}

      <motion.div className="profile-card emp-card" initial="hidden" animate="show" variants={fadeUp}>
        <div className="emp-card-header">
          <h2 className="section-title emp-section-title">Salarios a pagar</h2>
          {salarios && salarios.empleados.length > 0 && (
            <motion.button
              className="emp-btn-add-inline"
              onClick={descargarReporteGeneral}
              disabled={generandoReporte}
              whileTap={{ scale: 0.95 }}
            >
              <IconDownload />
              {generandoReporte ? "Generando..." : "Reporte PDF"}
            </motion.button>
          )}
        </div>

        <div className="emp-segmented">
          {PERIODOS.map((p) => (
            <button
              key={p.valor}
              className={`emp-segmented-btn ${periodoTipo === p.valor ? "activo" : ""}`}
              onClick={() => cambiarPeriodo(p.valor)}
              style={{ position: "relative" }}
            >
              {periodoTipo === p.valor && (
                <motion.span
                  layoutId="emp-segmented-highlight"
                  className="emp-segmented-highlight"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{p.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {periodoTipo === "personalizado" && (
            <motion.div
              className="emp-fechas"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 18 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <div className="form-field">
                <label>Desde</label>
                <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Hasta</label>
                <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {cargandoSalarios ? (
          <p className="panel-hint emp-loading-text">Calculando...</p>
        ) : salarios && salarios.empleados.length > 0 ? (
          <motion.ul
            key={periodoKey}
            className="emp-lista-limpia"
            initial="hidden"
            animate="show"
            variants={listContainer}
          >
            {salarios.empleados.map((s) => (
              <motion.li key={s.empleado_id} className="emp-salario-item" variants={listItem} layout>
                <button className="emp-fila emp-fila-btn" onClick={() => toggleDetalle(s.empleado_id)}>
                  <span className="emp-avatar">{iniciales(s.empleado_nombre)}</span>

                  <div className="emp-fila-info">
                    <span className="emp-fila-nombre">{s.empleado_nombre}</span>
                    <span className="emp-fila-horas">
                      <IconClockSmall /> {s.total_horas} h
                    </span>
                  </div>

                  <div className="emp-fila-derecha">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${s.empleado_id}-${periodoKey}-${s.total_salario}`}
                        className="price-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {formatearMoneda(s.total_salario)}
                      </motion.span>
                    </AnimatePresence>
                    <motion.span animate={{ rotate: expandidoId === s.empleado_id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <IconChevronDown />
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandidoId === s.empleado_id && (
                    <motion.div
                      className="emp-detalle"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{ overflowY: "hidden" }}
                    >
                      <div className="emp-detalle-header">
                        <p className="emp-detalle-titulo">Detalle por día</p>
                        <button
                          className="emp-btn-pdf"
                          onClick={() => descargarPdf(s.empleado_id, s.empleado_nombre)}
                          disabled={generandoPdfId === s.empleado_id}
                        >
                          <IconDownload />
                          {generandoPdfId === s.empleado_id ? "Generando..." : "Generar PDF"}
                        </button>
                      </div>

                      {cargandoDetalle && !detallePorId[s.empleado_id] ? (
                        <p className="panel-hint">Cargando...</p>
                      ) : (detallePorId[s.empleado_id] || []).length === 0 ? (
                        <p className="panel-hint">No hay turnos registrados en este período</p>
                      ) : (
                        <motion.div className="emp-dias-lista" initial="hidden" animate="show" variants={listContainer}>
                          {detallePorId[s.empleado_id].map((turno) =>
                            editandoTurnoId === turno.id ? (
                              <motion.div key={turno.id} className="emp-dia-fila-edit" variants={listItem}>
                                <span className="code-mono emp-dia-fecha">{formatearFechaCorta(turno.fecha)}</span>
                                <div className="emp-dia-edit-inputs">
                                  <input
                                    type="time"
                                    value={formTurno.hora_entrada}
                                    onChange={(e) => setFormTurno((f) => ({ ...f, hora_entrada: e.target.value }))}
                                  />
                                  <span>–</span>
                                  <input
                                    type="time"
                                    value={formTurno.hora_salida}
                                    onChange={(e) => setFormTurno((f) => ({ ...f, hora_salida: e.target.value }))}
                                  />
                                </div>
                                <div className="emp-dia-edit-botones">
                                  <button className="icon-btn" onClick={cancelarEdicionTurno} disabled={guardando}>
                                    <IconX />
                                  </button>
                                  <button
                                    className="icon-btn icon-btn-success"
                                    onClick={() => guardarTurno(turno.id, s.empleado_id)}
                                    disabled={guardando}
                                  >
                                    <IconCheck />
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div key={turno.id} className="emp-dia-fila" variants={listItem}>
                                <span className="code-mono emp-dia-fecha">{formatearFechaCorta(turno.fecha)}</span>
                                <span className="emp-dia-rango">
                                  {formatearHora(turno.hora_entrada)} – {formatearHora(turno.hora_salida)}
                                </span>
                                <span className="emp-dia-horas">
                                  {turno.horas_trabajadas != null ? `${turno.horas_trabajadas} h` : "en curso"}
                                </span>
                                <button className="icon-btn emp-dia-editar-btn" onClick={() => iniciarEdicionTurno(turno)}>
                                  <IconPencil />
                                </button>
                              </motion.div>
                            )
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="empty-state">No hay empleados activos registrados</div>
        )}
      </motion.div>
    </div>
  )
}