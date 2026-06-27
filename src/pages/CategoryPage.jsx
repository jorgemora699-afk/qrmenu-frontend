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

          <h1 className="category-title">
            {category.name}
          </h1>

          <p className="category-subtitle">
            {category.products.length} productos disponibles
          </p>

        </div>

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

      </div>
    </PageContainer>
  )
}

export default CategoryPage