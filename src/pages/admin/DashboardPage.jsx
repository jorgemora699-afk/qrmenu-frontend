import { useNavigate } from "react-router-dom"

function DashboardPage() {
  const navigate = useNavigate()
  const business = JSON.parse(localStorage.getItem("business") || "{}")

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
            PANEL DE ADMINISTRACIÓN
          </span>

          <h1 className="dashboard-title">
            Hola, {business.name}
          </h1>

          <p className="dashboard-subtitle">
            Administra tu menú digital desde aquí.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </div>

      <div className="admin-cards">

        <div
          className="admin-card"
          onClick={() => navigate("/admin/categories")}
        >
          <span className="admin-card-icon">🗂️</span>

          <div>
            <h3>Categorías</h3>
            <p>Organiza tu carta por secciones.</p>
          </div>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/products")}
        >
          <span className="admin-card-icon">🍽️</span>

          <div>
            <h3>Productos</h3>
            <p>Agrega y administra tus productos.</p>
          </div>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/profile")}
        >
          <span className="admin-card-icon">⚙️</span>

          <div>
            <h3>Perfil del negocio</h3>
            <p>Logo, banner, colores y datos.</p>
          </div>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate(`/${business.slug}`)}
        >
          <span className="admin-card-icon">👀</span>

          <div>
            <h3>Ver menú</h3>
            <p>Previsualiza tu menú público.</p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default DashboardPage