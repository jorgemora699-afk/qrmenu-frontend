import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import ChangePasswordModal from "../../pages/admin/ChangePasswordModal"
import ChangePinModal from "../../pages/admin/ChangePinModal"
import PinVerificationModal from "../../pages/admin/PinVerificationModal"

/* ---------- iconos (trazo fino, sin dependencias externas) ---------- */

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconUsers = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconFolder = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <path d="M3 7.5a2 2 0 0 1 2-2h4.2l1.6 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" opacity="0.16" />
    <path d="M3 7.5a2 2 0 0 1 2-2h4.2l1.6 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

const IconClock = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.16" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconDish = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <path d="M7 2v6.5a2 2 0 0 1-2 2 2 2 0 0 1-2-2V2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10.5V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 2c-1.7 0-3 2.24-3 5s1.3 5 3 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M5 2v3.2M9 2v3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
  </svg>
)

const IconSettings = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.4" fill="currentColor" opacity="0.14" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconEye = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="currentColor" opacity="0.14" />
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3.1" fill="currentColor" />
  </svg>
)

const IconQr = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.2" fill="currentColor" opacity="0.16" />
    <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5.2" y="5.2" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" fill="currentColor" opacity="0.16" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="16.2" y="5.2" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" fill="currentColor" opacity="0.16" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5.2" y="16.2" width="2.6" height="2.6" rx="0.5" fill="currentColor" />
    <rect x="14.5" y="14.5" width="2.7" height="2.7" rx="0.5" fill="currentColor" />
    <rect x="18.3" y="14.5" width="2.7" height="2.7" rx="0.5" fill="currentColor" />
    <rect x="14.5" y="18.3" width="2.7" height="2.7" rx="0.5" fill="currentColor" />
    <rect x="18.3" y="18.3" width="2.7" height="2.7" rx="0.5" fill="currentColor" opacity="0.5" />
  </svg>
)

const IconBook = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="currentColor" opacity="0.16" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

/* ---------- variantes de animación ---------- */

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const cardItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
}

/* ---------- tarjeta de navegación reutilizable ---------- */

function NavCard({ icon, iconClass, title, subtitle, onClick }) {
  return (
    <motion.button
      className="nav-card"
      onClick={onClick}
      variants={cardItem}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
    >
      <span className={`nav-card-icon ${iconClass}`}>
        {icon}
      </span>

      <span className="nav-card-body">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </span>

      <motion.span className="nav-card-arrow" whileHover={{ x: 3 }}>
        <IconChevronRight />
      </motion.span>
    </motion.button>
  )
}

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

      <motion.div
        className="dashboard-hero"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >

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

          <motion.button
            className="user-btn"
            onClick={() =>
              setShowUserMenu(!showUserMenu)
            }
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            whileTap={{ scale: 0.9 }}
          >
            <IconUser />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="user-dropdown"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >

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

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>

      <motion.div className="nav-list" initial="hidden" animate="show" variants={listContainer}>

        <NavCard
          icon={<IconFolder />}
          iconClass="nav-card-icon-brass"
          title="Categorías"
          subtitle="Organiza tu carta por secciones"
          onClick={() => requestPin("/admin/categories")}
        />

        <NavCard
          icon={<IconDish />}
          iconClass="nav-card-icon-wine"
          title="Productos"
          subtitle="Agrega y administra tus productos"
          onClick={() => requestPin("/admin/products")}
        />

        <NavCard
          icon={<IconSettings />}
          iconClass="nav-card-icon-slate"
          title="Perfil del negocio"
          subtitle="Logo, banner, colores y datos"
          onClick={() => requestPin("/admin/profile")}
        />

        <NavCard
          icon={<IconEye />}
          iconClass="nav-card-icon-green"
          title="Ver menú"
          subtitle="Previsualiza tu menú público"
          onClick={() => navigate(`/${business.slug}`)}
        />

        <NavCard
          icon={<IconQr />}
          iconClass="nav-card-icon-plum"
          title="Código QR"
          subtitle="Descarga e imprime el QR de tu menú"
          onClick={() => navigate("/admin/qr")}
        />

        {business.recipes_enabled && (
          <NavCard
            icon={<IconBook />}
            iconClass="nav-card-icon-teal"
            title="Recetas"
            subtitle="Consulta la preparación de tus productos"
            onClick={() => navigate("/admin/recipes")}
          />
        )}

        {business.horario_enabled && (
          <NavCard
            icon={<IconClock />}
            iconClass="nav-card-icon-brass"
            title="Horarios"
            subtitle="Registro de entrada y salida de empleados"
            onClick={() => navigate("/admin/horario")}
          />
        )}

        {business.horario_enabled && (
          <NavCard
            icon={<IconUsers />}
            iconClass="nav-card-icon-slate"
            title="Empleados"
            subtitle="Administra tu equipo y calcula salarios"
            onClick={() => requestPin("/admin/empleados")}
          />
        )}

      </motion.div>

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