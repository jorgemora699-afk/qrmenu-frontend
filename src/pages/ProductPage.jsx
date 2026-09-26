import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
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

  const { business, product, loading: productLoading } = useProduct(slug, categoryId, productId)
  const { category, loading: categoryLoading } = useCategory(slug, categoryId)

  const loading = productLoading || categoryLoading

  if (loading) return <Loading />
  if (!product) return <ErrorState message="Producto no encontrado" />

  const backgroundSource = {
    ...business,
    banner_url: category?.image_url || business?.banner_url,
  }

  return (
    <PageContainer business={business}>
      <div className="product-page">

        <PageBackground business={backgroundSource} />

        <div className={`product-image-wrap ${!product.image_url ? "is-fallback" : ""}`}>

          <motion.button
            className="product-back-btn"
            onClick={() => navigate(`/${slug}/${categoryId}`)}
            aria-label="Volver al menú"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileTap={{ scale: 0.94 }}
          >
            ← Volver
          </motion.button>

          <ProductImage
            src={product.image_url}
            alt={product.name}
            productId={product.id}
          />

        </div>

        <motion.div
          className="product-content"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >

          <motion.h1
            className="product-title"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            {product.name}
          </motion.h1>

          {product.description && (
            <motion.p
              className="product-description"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.18 }}
            >
              {product.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.26, ease: "backOut" }}
          >
            <ProductPrice price={product.price} />
          </motion.div>

        </motion.div>

      </div>
    </PageContainer>
  )
}

export default ProductPage