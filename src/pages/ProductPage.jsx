import { useLocation, useParams, useNavigate } from "react-router-dom"

function ProductPage() {
  const { slug, categoryId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const product = state?.product
  const category = state?.category

  if (!product) {
    navigate(`/${slug}`)
    return null
  }

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(`/${slug}/${categoryId}`, { state: { category } })}>
        ← Volver
      </button>

      {product.image_url && (
        <img src={product.image_url} alt={product.name} className="product-image" />
      )}

      <div className="product-detail">
        <h2>{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <span className="product-price-big">${product.price.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default ProductPage