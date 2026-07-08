import { useState, useEffect } from "react"
import axios from "axios"

const BASE_URL = "https://menunegocio-production.up.railway.app"

/* ---------- iconos ---------- */

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconBan = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" />
  </svg>
)

function SuperadminPage() {
  const [key, setKey] = useState(sessionStorage.getItem("superadmin_key") || "")
  const [keyInput, setKeyInput] = useState("")

  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  const authHeaders = { headers: { "X-Superadmin-Key": key } }

  useEffect(() => {
    if (key) fetchCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const fetchCodes = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get(`${BASE_URL}/api/superadmin/invite-codes`, authHeaders)
      setCodes(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Clave incorrecta")
        handleLogout()
      } else {
        setError("No se pudo cargar la lista de códigos")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    if (!keyInput.trim()) return
    sessionStorage.setItem("superadmin_key", keyInput.trim())
    setKey(keyInput.trim())
  }

  const handleLogout = () => {
    sessionStorage.removeItem("superadmin_key")
    setKey("")
    setKeyInput("")
    setCodes([])
  }

  const handleCreate = async () => {
    setCreating(true)
    setError("")
    try {
      const res = await axios.post(
        `${BASE_URL}/api/superadmin/invite-codes`,
        { label: label.trim() },
        authHeaders
      )
      setCodes([res.data, ...codes])
      setLabel("")
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo generar el código")
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id) => {
    if (!window.confirm("¿Revocar este código? Ya no se podrá usar para registrarse.")) return

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/superadmin/invite-codes/${id}/revoke`,
        {},
        authHeaders
      )
      setCodes(codes.map((c) => (c.id === id ? res.data : c)))
    } catch (err) {
      alert(err.response?.data?.error || "No se pudo revocar el código")
    }
  }

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const formatDate = (iso) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const statusLabel = { unused: "Disponible", used: "Usado", revoked: "Revocado" }
  const statusClass = {
    unused: "availability-pill-on",
    used: "availability-pill-used",
    revoked: "availability-pill-off"
  }

  if (!key) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <span className="login-eyebrow">Acceso restringido</span>
          <h2>Panel de códigos</h2>
          <div className="login-rule" />
          <p>Ingresa tu clave de super-administrador</p>

          {error && <div className="error-msg">{error}</div>}

          <input
            type="password"
            placeholder="Clave secreta"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          />

          <button onClick={handleUnlock}>Entrar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">

      <header className="panel-header">
        <div className="panel-header-top">
          <h2 className="panel-title">Códigos de invitación</h2>
          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </div>
        <div className="panel-rule" />
        <p className="panel-hint">Genera un código único por cada negocio que quieras dar de alta</p>
      </header>

      <section className="add-card">
        <span className="add-card-label">Nuevo código</span>

        <div className="add-card-row">
          <input
            placeholder="Etiqueta (ej: Café Aroma - WhatsApp)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>

        <button className="btn-primary" onClick={handleCreate} disabled={creating}>
          {creating ? "Generando..." : "Generar código"}
        </button>
      </section>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : codes.length === 0 ? (
        <div className="empty-state">Todavía no has generado ningún código.</div>
      ) : (
        <ol className="menu-ledger">
          {codes.map((c) => (
            <li key={c.id} className="ledger-row">

              <div className="code-row-main">
                <span className="code-mono">{c.code}</span>
                <span className="code-label">{c.label || "Sin etiqueta"}</span>
                <span className="code-meta">
                  {formatDate(c.created_at)}
                  {c.status === "used" && c.used_by_business_name ? ` · ${c.used_by_business_name}` : ""}
                </span>
              </div>

              <div className="ledger-actions">
                <span className={`availability-pill ${statusClass[c.status]}`}>
                  {statusLabel[c.status]}
                </span>

                <div className="ledger-divider" />

                <button
                  className="icon-btn"
                  onClick={() => handleCopy(c.code, c.id)}
                  title="Copiar código"
                  aria-label="Copiar código"
                >
                  {copiedId === c.id ? <IconCheck /> : <IconCopy />}
                </button>

                {c.status === "unused" && (
                  <button
                    className="icon-btn icon-btn-danger"
                    onClick={() => handleRevoke(c.id)}
                    title="Revocar"
                    aria-label="Revocar código"
                  >
                    <IconBan />
                  </button>
                )}
              </div>

            </li>
          ))}
        </ol>
      )}

    </div>
  )
}

export default SuperadminPage