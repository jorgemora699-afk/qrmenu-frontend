import { useParams, useNavigate } from "react-router-dom"
import { useCategory } from "../hooks/useCategory"
import ProductCard from "../components/product/ProductCard"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"

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
    </PageContainer>
  )
}

export default CategoryPage