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
  const secondary = business.secondary_color || "#ffffff"

  return (
    <div className="menu-page" style={{ padding: 0 }}>

      {/* HEADER */}
      <div
        className="menu-hero"
        style={{
          backgroundImage: business.banner_url ? `url(${business.banner_url})` : "none",
          backgroundColor: business.banner_url ? "transparent" : primary,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="menu-hero-overlay"
          style={{ background: business.banner_url ? `${primary}bb` : primary }}
        >
          {business.logo_url && (
            <img src={business.logo_url} alt={business.name} className="hero-logo" />
          )}
          <h1 className="hero-title" style={{ color: secondary }}>{business.name}</h1>
          {business.tagline && (
            <p className="hero-tagline" style={{ color: secondary }}>{business.tagline}</p>
          )}
        </div>
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