import { useParams, useNavigate } from "react-router-dom"
import { useCategory } from "../hooks/useCategory"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"
import ProductCard from "../components/product/ProductCard"
import PageContainer from "../components/layout/PageContainer"

function CategoryPage() {
  const { slug, categoryId } = useParams()
  const navigate = useNavigate()

  const { category, loading } = useCategory(slug, categoryId)

  if (loading) return <Loading />

  if (!category) {
    return <ErrorState message="Categoría no encontrada" />
  }

  return (
    <PageContainer>
      <div className="category-page">

        <div className="category-header">

          <button
            className="back-btn"
            onClick={() => navigate(`/${slug}`)}
          >
            ← Menú
          </button>

          <span className="category-eyebrow">Carta</span>

          <h1 className="category-title">
            {category.name}
          </h1>

          <div className="category-rule" />

          <p className="category-subtitle">
            {category.products.length} {category.products.length === 1 ? "producto disponible" : "productos disponibles"}
          </p>

        </div>

        {category.products.length === 0 ? (
          <div className="empty-state">
            Todavía no hay productos en esta categoría.
          </div>
        ) : (
          <div className="products-list">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() =>
                  navigate(`/${slug}/${categoryId}/${product.id}`)
                }
              />
            ))}
          </div>
        )}

      </div>
    </PageContainer>
  )
}

export default CategoryPage