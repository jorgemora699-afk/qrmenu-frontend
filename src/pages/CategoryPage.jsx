import { useParams, useNavigate } from "react-router-dom"
import { useCategory } from "../hooks/useCategory"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"
import ProductCard from "../components/product/ProductCard"
import PageContainer from "../components/layout/PageContainer"
import PageBackground from "../components/layout/PageBackground"

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

        <button
          className="category-back-btn"
          onClick={handleBack}
          aria-label="Volver"
        >
          ←
        </button>

        <div className="category-content">

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

          {/* SUBCATEGORÍAS */}
          {children.length > 0 && (
            <div className="products-list">

              {children.map((child) => (

                <ProductCard
                  key={child.id}
                  product={{
                    name: child.name,
                    description: "",
                    image_url: child.image_url
                  }}
                  isCategory
                  onClick={() =>
                    navigate(`/${slug}/${child.id}`)
                  }
                />

              ))}

            </div>
          )}

          {/* SEPARADOR ENTRE SUBCATEGORÍAS Y PRODUCTOS */}
          {children.length > 0 && category.products.length > 0 && (
            <p className="category-subtitle" style={{ margin: "22px 0 4px" }}>
            </p>
          )}

          {/* PRODUCTOS */}
          {category.products.length > 0 && (
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

          {/* VACÍO */}
          {children.length === 0 && category.products.length === 0 && (
            <div className="empty-state">
              Todavía no hay elementos en esta categoría.
            </div>
          )}

        </div>

      </div>
    </PageContainer>
  )
}

export default CategoryPage