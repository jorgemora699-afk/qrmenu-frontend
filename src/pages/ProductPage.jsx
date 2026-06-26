import { useParams, useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"

function ProductPage() {
  const { slug, categoryId, productId } = useParams()
  const navigate = useNavigate()

  const {
    product,
    loading
  } = useProduct(slug, categoryId, productId)

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!product) {
    return <div className="error">Producto no encontrado</div>
  }

  return (
    <div className="product-page">
      <button
        className="back-btn"
        onClick={() => navigate(`/${slug}/${categoryId}`)}
      >
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