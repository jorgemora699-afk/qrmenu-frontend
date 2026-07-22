import { useParams, useNavigate } from "react-router-dom"
import MenuHero from "../components/menu/MenuHero"
import CategoriesGrid from "../components/menu/CategoriesGrid"
import { useMenu } from "../hooks/useMenu"
import PageBackground from "../components/layout/PageBackground"
import PageContainer from "../components/layout/PageContainer"
import Loading from "../components/common/Loading"
import ErrorState from "../components/common/ErrorState"

function MenuPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { business, categories, loading } = useMenu(slug)
  const isAdmin = !!localStorage.getItem("token")

  if (loading) return <Loading />

  if (!business) {
    return <ErrorState message="Negocio no encontrado" />
  }


  return (
    <PageContainer business={business}>
    <div className="menu-page">

      {/* FONDO: la foto del negocio cubre toda la pantalla, no solo el header.
          Es 'fixed' para que al hacer scroll de la lista de categorías,
          la imagen se quede fija detrás (efecto de profundidad). */}
      <PageBackground business={business} />

      {isAdmin && (
        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Volver al panel
        </button>
      )}

      {/* HEADER */}
      <MenuHero business={business} />

      {/* CATEGORÍAS */}
      <CategoriesGrid
        categories={categories}
        onCategoryClick={(category) =>
          navigate(`/${slug}/${category.id}`)
        }
      />
    </div>
    </PageContainer>
  )
}

export default MenuPage