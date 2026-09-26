import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
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

        <PageBackground business={business} />

        {isAdmin && (
          <button className="admin-back-btn" onClick={() => navigate("/admin")}>
            ← Volver al panel
          </button>
        )}

        {/* HERO: entra con blur→foco + leve subida, como si la cámara
            enfocara la foto del negocio al cargar */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <MenuHero business={business} />
        </motion.div>

        <CategoriesGrid
          categories={categories}
          onCategoryClick={(category) => navigate(`/${slug}/${category.id}`)}
        />
      </div>
    </PageContainer>
  )
}

export default MenuPage