import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMenu } from "../services/api"

function MenuPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [business, setBusiness] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMenu(slug)
      .then((res) => {
        setBusiness(res.data.business)
        setCategories(res.data.categories)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="loading">Cargando menú...</div>
  if (!business) return <div className="error">Negocio no encontrado</div>

  const primary = business.primary_color || "#222222"

  return (
    <div className="menu-page">

      {/* FONDO: la foto del negocio cubre toda la pantalla, no solo el header.
          Es 'fixed' para que al hacer scroll de la lista de categorías,
          la imagen se quede fija detrás (efecto de profundidad). */}
      <div
        className={`menu-page-bg ${business.banner_url ? "" : "no-image"}`}
        style={{
          backgroundImage: business.banner_url ? `url(${business.banner_url})` : "none",
          "--biz-primary": primary,
        }}
      />

      {/* HEADER */}
      <div className="menu-hero">
        {business.logo_url && (
          <img src={business.logo_url} alt={business.name} className="hero-logo" />
        )}
        <h1 className="hero-title">{business.name}</h1>
        {business.tagline && (
          <p className="hero-tagline">{business.tagline}</p>
        )}
      </div>

      {/* CATEGORÍAS */}
      <div className="menu-body">
        <p className="menu-subtitle">¿Qué deseas ver?</p>
        <div className="categories-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/${slug}/${cat.id}`, { state: { category: cat } })}
            >
              <span className="category-emoji">{cat.emoji || "🍽"}</span>
              <div className="category-info">
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.products.length} productos</span>
              </div>
              <span className="category-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuPage