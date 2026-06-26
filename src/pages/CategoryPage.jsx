import { useLocation, useParams, useNavigate } from "react-router-dom"

function CategoryPage() {
  const { slug, categoryId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const category = state?.category

  if (!category) {
    navigate(`/${slug}`)
    return null
  }

  return (
    <div className="category-page">
      <button className="back-btn" onClick={() => navigate(`/${slug}`)}>
        ← Volver
      </button>

      <h2>{category.name}</h2>

      <div className="products-list">
        {category.products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/${slug}/${categoryId}/${product.id}`, { state: { product, category } })}
          >
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="product-thumb" />
            )}
            <div className="product-info">
              <span className="product-name">{product.name}</span>
              <span className="product-price">${product.price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage