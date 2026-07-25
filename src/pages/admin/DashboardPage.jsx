import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import ChangePasswordModal from "../../pages/admin/ChangePasswordModal"
import ChangePinModal from "../../pages/admin/ChangePinModal"
import PinVerificationModal from "../../pages/admin/PinVerificationModal"

/* ---------- iconos (trazo fino, sin dependencias externas) ---------- */

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconFolder = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

const IconDish = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
  </svg>
)

const IconSettings = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const IconEye = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconQr = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
  </svg>
)

const IconBook = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.5 12.5 19 4M17 6l2 2M14 9l2 2" />
  </svg>
)

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

function DashboardPage() {
  const navigate = useNavigate()

  const business = JSON.parse(
    localStorage.getItem("business") || "{}"
  )

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [pendingRoute, setPendingRoute] = useState("")

  const menuRef = useRef(null)

  const requestPin = (route) => {
    setPendingRoute(route)
    setShowPinVerification(true)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("business")
    navigate("/admin/login")
  }

  return (
    <div className="admin-page">

      <div className="dashboard-hero">

        <div>
          <span className="dashboard-label">
            Panel de administración
          </span>

          <h1 className="dashboard-title">
            Hola, {business.name}
          </h1>

          <div className="panel-rule" />

          <p className="dashboard-subtitle">
            Administra tu menú digital desde aquí
          </p>
        </div>

        <div
          className="user-menu"
          ref={menuRef}
        >

          <button
            className="user-btn"
            onClick={() =>
              setShowUserMenu(!showUserMenu)
            }
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <IconUser />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">

              <button
                onClick={() => {
                  setShowPasswordModal(true)
                  setShowUserMenu(false)
                }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <IconLock />
                Cambiar contraseña
              </button>

              <button
                onClick={() => {
                  setShowPinModal(true)
                  setShowUserMenu(false)
                }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <IconKey />
                Cambiar PIN
              </button>

              <hr />

              <button
                className="logout-option"
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <IconLogout />
                Cerrar sesión
              </button>

            </div>
          )}

        </div>

      </div>

      <div className="nav-list">

        <button
          className="nav-card"
          onClick={() => requestPin("/admin/categories")}
        >
          <span className="nav-card-icon nav-card-icon-brass">
            <IconFolder />
          </span>

          <span className="nav-card-body">
            <h3>Categorías</h3>
            <p>Organiza tu carta por secciones</p>
          </span>

          <span className="nav-card-arrow">
            <IconChevronRight />
          </span>
        </button>

        <button
          className="nav-card"
          onClick={() => requestPin("/admin/products")}
        >
          <span className="nav-card-icon nav-card-icon-wine">
            <IconDish />
          </span>

          <span className="nav-card-body">
            <h3>Productos</h3>
            <p>Agrega y administra tus productos</p>
          </span>

          <span className="nav-card-arrow">
            <IconChevronRight />
          </span>
        </button>

        <button
          className="nav-card"
          onClick={() => requestPin("/admin/profile")}
        >
          <span className="nav-card-icon nav-card-icon-slate">
            <IconSettings />
          </span>

          <span className="nav-card-body">
            <h3>Perfil del negocio</h3>
            <p>Logo, banner, colores y datos</p>
          </span>

          <span className="nav-card-arrow">
            <IconChevronRight />
          </span>
        </button>

        <button
          className="nav-card"
          onClick={() => navigate(`/${business.slug}`)}
        >
          <span className="nav-card-icon nav-card-icon-green">
            <IconEye />
          </span>

          <span className="nav-card-body">
            <h3>Ver menú</h3>
            <p>Previsualiza tu menú público</p>
          </span>

          <span className="nav-card-arrow">
            <IconChevronRight />
          </span>
        </button>

        <button
          className="nav-card"
          onClick={() => navigate("/admin/qr")}
        >
          <span className="nav-card-icon nav-card-icon-plum">
            <IconQr />
          </span>

          <span className="nav-card-body">
            <h3>Código QR</h3>
            <p>Descarga e imprime el QR de tu menú</p>
          </span>

          <span className="nav-card-arrow">
            <IconChevronRight />
          </span>
        </button>

        {business.recipes_enabled && (
          <button
            className="nav-card"
            onClick={() => navigate("/admin/recipes")}
          >
            <span className="nav-card-icon nav-card-icon-teal">
              <IconBook />
            </span>

            <span className="nav-card-body">
              <h3>Recetas</h3>
              <p>Consulta la preparación de tus productos</p>
            </span>

            <span className="nav-card-arrow">
              <IconChevronRight />
            </span>
          </button>
        )}

      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <ChangePinModal
        open={showPinModal}
        onClose={() => setShowPinModal(false)}
      />

      <PinVerificationModal
        open={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onSuccess={() => {
          navigate(pendingRoute)
          setPendingRoute("")
        }}
      />

    </div>
  )
}

export default DashboardPage