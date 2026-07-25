import { useParams, useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { useCategory } from "../hooks/useCategory"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"
import PageContainer from "../components/layout/PageContainer"
import PageBackground from "../components/layout/PageBackground"
import ProductImage from "../components/product/ProductImage"
import ProductPrice from "../components/product/ProductPrice"

function ProductPage() {
  const { slug, categoryId, productId } = useParams()
  const navigate = useNavigate()

  const {
    business,
    product,
    loading: productLoading
  } = useProduct(slug, categoryId, productId)

  const {
    category,
    loading: categoryLoading
  } = useCategory(slug, categoryId)

  const loading = productLoading || categoryLoading

  if (loading) return <Loading />

  if (!product) {
    return <ErrorState message="Producto no encontrado" />
  }

  const backgroundSource = {
    ...business,
    banner_url: category?.image_url || business?.banner_url,
  }

  return (
    <PageContainer business={business}>

      <div className="product-page">

        <PageBackground business={backgroundSource} />

        <div className={`product-image-wrap ${!product.image_url ? "is-fallback" : ""}`}>

          <button
            className="product-back-btn"
            onClick={() => navigate(`/${slug}/${categoryId}`)}
            aria-label="Volver al menú"
          >
            ←
          </button>

          <ProductImage
            src={product.image_url}
            alt={product.name}
            fallbackSrc={business?.banner_url}
          />

        </div>

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