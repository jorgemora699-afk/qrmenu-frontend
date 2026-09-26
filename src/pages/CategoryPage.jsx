import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useCategory } from "../hooks/useCategory"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"
import ProductCard from "../components/product/ProductCard"
import PageContainer from "../components/layout/PageContainer"
import PageBackground from "../components/layout/PageBackground"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3, delayChildren: 0.25 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

function CategoryPage() {
  const { slug, categoryId } = useParams()
  const navigate = useNavigate()

  const {
    business,
    category,
    children,
    loading
  } = useCategory(slug, categoryId)

  if (loading) return <Loading />

  if (!category) {
    return <ErrorState message="Categoría no encontrada" />
  }

  const backgroundSource = {
    ...business,
    banner_url: category.image_url || business?.banner_url,
  }

  const handleBack = () => {
    if (category.parent_id) {
      navigate(`/${slug}/${category.parent_id}`)
    } else {
      navigate(`/${slug}`)
    }
  }

  return (
    <PageContainer business={business}>
      <div className="category-page">

        <PageBackground business={backgroundSource} />

        <motion.button
          className="category-back-btn"
          onClick={handleBack}
          aria-label="Volver"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.94 }}
        >
          ← Volver
        </motion.button>

        <motion.div
          className="category-content"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >

          <span className="category-eyebrow">
            Carta
          </span>

          <h1 className="category-title">
            {category.name}
          </h1>

          <div className="category-rule" />

          <p className="category-subtitle">
            {children.length + category.products.length}{" "}
            {children.length + category.products.length === 1
              ? "elemento"
              : "elementos"}
          </p>

          {/* PRODUCTOS */}
          {category.products.length > 0 && (
            <motion.div
              className="products-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {category.products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    onClick={() =>
                      navigate(`/${slug}/${categoryId}/${product.id}`)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* SEPARADOR ENTRE SUBCATEGORÍAS Y PRODUCTOS */}
          {children.length > 0 && category.products.length > 0 && (
            <p className="category-subtitle" style={{ margin: "22px 0 4px" }}>
            </p>
          )}

          {/* SUBCATEGORÍAS */}
          {children.length > 0 && (
            <motion.div
              className="products-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {children.map((child) => (
                <motion.div key={child.id} variants={itemVariants}>
                  <ProductCard
                    product={{
                      name: child.name,
                      description: "",
                      image_url: child.image_url
                    }}
                    isCategory
                    onClick={() => navigate(`/${slug}/${child.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* VACÍO */}
          {children.length === 0 && category.products.length === 0 && (
            <div className="empty-state">
              Todavía no hay elementos en esta categoría.
            </div>
          )}

        </motion.div>

      </div>
    </PageContainer>
  )
}

export default CategoryPage