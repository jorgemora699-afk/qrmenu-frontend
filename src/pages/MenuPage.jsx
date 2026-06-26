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

  return (
    <div className="menu-page">
      <div className="menu-header">
        {business.logo_url && <img src={business.logo_url} alt={business.name} className="logo" />}
        <h1>{business.name}</h1>
        <p>Selecciona una categoría</p>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => navigate(`/${slug}/${cat.id}`, { state: { category: cat } })}
          >
            <span className="category-name">{cat.name}</span>
            <span className="category-count">{cat.products.length} productos</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MenuPage