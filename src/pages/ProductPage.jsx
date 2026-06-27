import { useParams, useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"
import PageContainer from "../components/layout/PageContainer"
import ProductImage from "../components/product/ProductImage"
import ProductPrice from "../components/product/ProductPrice"

function ProductPage() {
  const { slug, categoryId, productId } = useParams()
  const navigate = useNavigate()

  const {
    product,
    loading
  } = useProduct(slug, categoryId, productId)

  if (loading) return <Loading />

  if (!product) {
    return <ErrorState message="Producto no encontrado" />
  }

  return (
    <PageContainer>

      <div className="product-page">

        <button
          className="back-btn"
          onClick={() => navigate(`/${slug}/${categoryId}`)}
        >
          ← Menú
        </button>

        <ProductImage
          src={product.image_url}
          alt={product.name}
        />

        <div className="product-content">

          <h1 className="product-title">
            {product.name}
          </h1>

          {product.description && (
            <p className="product-description">
              {product.description}
            </p>
          )}

          <ProductPrice
            price={product.price}
          />

        </div>

      </div>

    </PageContainer>
  )
}

export default ProductPage