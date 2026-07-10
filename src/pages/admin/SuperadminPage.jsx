import { useState, useEffect } from "react"
import axios from "axios"

const BASE_URL = "https://menunegocio-production.up.railway.app"

// 👉 Cambia esto por tu número de WhatsApp (con código de país, sin +, sin espacios)
const SUPERADMIN_WHATSAPP = "573127189560"

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

const IconKey = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-9.6 9.6" />
    <path d="M15.5 7.5L19 11" />
    <path d="M13 5l3.5 3.5" />
  </svg>
)

const IconWhatsapp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.79 14.09c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.89 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
  </svg>
)

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

function SuperadminPage() {
  const [key, setKey] = useState(sessionStorage.getItem("superadmin_key") || "")
  const [keyInput, setKeyInput] = useState("")
  const [error, setError] = useState("")
  const [tab, setTab] = useState("codes") // "codes" | "businesses"

  const authHeaders = { headers: { "X-Superadmin-Key": key } }

  const handleUnlock = () => {
    if (!keyInput.trim()) return
    sessionStorage.setItem("superadmin_key", keyInput.trim())
    setKey(keyInput.trim())
  }

  const handleLogout = () => {
    sessionStorage.removeItem("superadmin_key")
    setKey("")
    setKeyInput("")
  }

  if (!key) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <span className="login-eyebrow">Acceso restringido</span>
          <h2>Panel de administración</h2>
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
          <h2 className="panel-title">Superadmin</h2>
          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </div>
        <div className="panel-rule" />
        <div className="superadmin-tabs">
          <button
            className={`superadmin-tab ${tab === "codes" ? "superadmin-tab-active" : ""}`}
            onClick={() => setTab("codes")}
          >
            Códigos
          </button>
          <button
            className={`superadmin-tab ${tab === "businesses" ? "superadmin-tab-active" : ""}`}
            onClick={() => setTab("businesses")}
          >
            Negocios
          </button>
        </div>
      </header>

      {tab === "codes" ? (
        <InviteCodesTab authHeaders={authHeaders} onAuthError={handleLogout} setGlobalError={setError} />
      ) : (
        <BusinessesTab authHeaders={authHeaders} onAuthError={handleLogout} setGlobalError={setError} />
      )}

    </div>
  )
}

/* ============================== CÓDIGOS ============================== */

function InviteCodesTab({ authHeaders, onAuthError, setGlobalError }) {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCodes = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get(`${BASE_URL}/api/superadmin/invite-codes`, authHeaders)
      setCodes(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        setGlobalError("Clave incorrecta")
        onAuthError()
      } else {
        setError("No se pudo cargar la lista de códigos")
      }
    } finally {
      setLoading(false)
    }
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
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
  }

  const statusLabel = { unused: "Disponible", used: "Usado", revoked: "Revocado" }
  const statusClass = {
    unused: "availability-pill-on",
    used: "availability-pill-used",
    revoked: "availability-pill-off"
  }

  return (
    <>
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
    </>
  )
}

/* ============================== NEGOCIOS ============================== */

function BusinessesTab({ authHeaders, onAuthError, setGlobalError }) {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [resetResult, setResetResult] = useState(null) // { businessId, email, password }
  const [copiedField, setCopiedField] = useState(null)

  useEffect(() => {
    fetchBusinesses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBusinesses = async (q = "") => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get(`${BASE_URL}/api/superadmin/businesses`, {
        ...authHeaders,
        params: q ? { q } : {}
      })
      setBusinesses(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        setGlobalError("Clave incorrecta")
        onAuthError()
      } else {
        setError("No se pudo cargar la lista de negocios")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (business) => {
    if (!window.confirm(`¿Generar una contraseña nueva para "${business.name}"? La anterior dejará de funcionar.`)) return

    try {
      const res = await axios.post(
        `${BASE_URL}/api/superadmin/businesses/${business.id}/reset-password`,
        {},
        authHeaders
      )
      setResetResult({ businessId: business.id, email: res.data.email, password: res.data.new_password })
    } catch (err) {
      alert(err.response?.data?.error || "No se pudo restablecer la contraseña")
    }
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const whatsappResetLink = (email, password) => {
    const text = `Hola! Restablecimos el acceso a tu panel.\n\nCorreo: ${email}\nContraseña nueva: ${password}\n\nPor seguridad, te recomendamos cambiarla apenas ingreses.`
    return `https://wa.me/${SUPERADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`
  }

  return (
    <>
      <section className="add-card">
        <span className="add-card-label">Buscar negocio</span>
        <div className="add-card-row">
          <input
            placeholder="Nombre, correo o URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchBusinesses(search)}
          />
          <button className="icon-btn" onClick={() => fetchBusinesses(search)} title="Buscar" aria-label="Buscar">
            <IconSearch />
          </button>
        </div>
      </section>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : businesses.length === 0 ? (
        <div className="empty-state">No se encontraron negocios.</div>
      ) : (
        <ol className="menu-ledger">
          {businesses.map((b) => (
            <li key={b.id} className="ledger-row business-row">

              <div className="business-row-content">
                <div className="code-row-main">
                  <span className="code-mono">{b.name}</span>
                  <span className="code-label">{b.email}</span>
                  <span className="code-meta">/{b.slug}</span>
                </div>

                <div className="business-row-actions">
                  <button
                    className="icon-btn"
                    onClick={() => handleResetPassword(b)}
                    title="Restablecer contraseña"
                    aria-label="Restablecer contraseña"
                  >
                    <IconKey />
                  </button>
                </div>
              </div>

              {resetResult && resetResult.businessId === b.id && (
                <div className="reset-result">
                  <div className="reset-result-row">
                    <span className="code-mono">{resetResult.password}</span>
                    <button className="icon-btn" onClick={() => handleCopy(resetResult.password, "pwd")} title="Copiar contraseña">
                      {copiedField === "pwd" ? <IconCheck /> : <IconCopy />}
                    </button>
                    <a
                      className="icon-btn"
                      href={whatsappResetLink(resetResult.email, resetResult.password)}
                      target="_blank"
                      rel="noreferrer"
                      title="Enviar por WhatsApp"
                    >
                      <IconWhatsapp />
                    </a>
                    <button className="icon-btn" onClick={() => setResetResult(null)} title="Cerrar">
                      <IconBan />
                    </button>
                  </div>
                  <span className="invite-hint">Cópiala o mándala ahora — no se vuelve a mostrar</span>
                </div>
              )}

            </li>
          ))}
        </ol>
      )}
    </>
  )
}

export default SuperadminPage