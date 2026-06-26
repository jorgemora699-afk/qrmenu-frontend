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
      <div className="admin-header">
        <div>
          <h2>Bienvenido</h2>
          <p>{business.name}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="admin-cards">
        <div className="admin-card" onClick={() => navigate("/admin/categories")}>
          <span className="admin-card-icon">🗂</span>
          <h3>Categorías</h3>
          <p>Gestiona las categorías de tu carta</p>
        </div>
        <div className="admin-card" onClick={() => navigate("/admin/products")}>
          <span className="admin-card-icon">🍽</span>
          <h3>Productos</h3>
          <p>Agrega, edita o elimina productos</p>
        </div>
        <div className="admin-card" onClick={() => navigate(`/${business.slug}`)}>
          <span className="admin-card-icon">👁</span>
          <h3>Ver menú</h3>
          <p>Así ve tu carta el cliente</p>
        </div>
        <div className="admin-card" onClick={() => navigate("/admin/profile")}>
            <span className="admin-card-icon">⚙️</span>
            <h3>Perfil</h3>
            <p>Edita nombre, logo, colores y slogan</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage