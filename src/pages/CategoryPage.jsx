import { useParams, useNavigate } from "react-router-dom"
import { useCategory } from "../hooks/useCategory"
import ProductCard from "../components/product/ProductCard"

function CategoryPage() {
  const { slug, categoryId } = useParams()
  const navigate = useNavigate()

  const { category, loading } = useCategory(slug, categoryId)

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!category) {
    return <div className="error">Categoría no encontrada</div>
  }

  return (
    <div className="category-page">
      <button className="back-btn" onClick={() => navigate(`/${slug}`)}>
        ← Volver
      </button>

      <h2>{category.name}</h2>

      <div className="products-list">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() =>
              navigate(`/${slug}/${categoryId}/${product.id}`, {
                state: { product, category },
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage