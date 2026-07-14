import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import ChangePasswordModal from "../../components/admin/ChangePasswordModal"

const IconChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

function DashboardPage() {
  const navigate = useNavigate()

  const business = JSON.parse(
    localStorage.getItem("business") || "{}"
  )

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const menuRef = useRef(null)

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
          >
            👤
          </button>

          {showUserMenu && (
            <div className="user-dropdown">

              <button
                onClick={() => {
                  setShowPasswordModal(true)
                  setShowUserMenu(false)
                }}
              >
                🔒 Cambiar contraseña
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false)
                  navigate("/admin/pin")
                }}
              >
                🔑 Cambiar PIN
              </button>

              <hr />

              <button
                className="logout-option"
                onClick={handleLogout}
              >
                🚪 Cerrar sesión
              </button>

            </div>
          )}

        </div>

      </div>

      <div className="nav-list">

        <button
          className="nav-card"
          onClick={() => navigate("/admin/categories")}
        >
          <span className="nav-card-icon">🗂️</span>

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
          onClick={() => navigate("/admin/products")}
        >
          <span className="nav-card-icon">🍽️</span>

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
          onClick={() => navigate("/admin/profile")}
        >
          <span className="nav-card-icon">⚙️</span>

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
          <span className="nav-card-icon">👀</span>

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
          <span className="nav-card-icon">📱</span>

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
            <span className="nav-card-icon">📖</span>

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

    </div>
  )
}

export default DashboardPage