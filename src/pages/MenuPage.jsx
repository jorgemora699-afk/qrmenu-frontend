import { useParams, useNavigate } from "react-router-dom"
import MenuHero from "../components/menu/MenuHero"
import CategoriesGrid from "../components/menu/CategoriesGrid"
import { useMenu } from "../hooks/useMenu"
import PageBackground from "../components/layout/PageBackground"

function MenuPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { business, categories, loading } = useMenu(slug)

  if (loading) return <div className="loading">Cargando menú...</div>
  if (!business) return <div className="error">Negocio no encontrado</div>


  return (
    <div className="menu-page">

      {/* FONDO: la foto del negocio cubre toda la pantalla, no solo el header.
          Es 'fixed' para que al hacer scroll de la lista de categorías,
          la imagen se quede fija detrás (efecto de profundidad). */}
      <PageBackground business={business} />

      {/* HEADER */}
      <MenuHero business={business} />

      {/* CATEGORÍAS */}
      <CategoriesGrid
        categories={categories}
        onCategoryClick={(category) =>
          navigate(`/${slug}/${category.id}`, {
            state: { category },
          })
        }
      />
    </div>
  )
}

export default MenuPage