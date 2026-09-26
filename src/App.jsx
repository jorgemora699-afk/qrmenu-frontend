import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { getProfile } from "./services/api"
import MenuPage from "./pages/MenuPage"
import CategoryPage from "./pages/CategoryPage"
import ProductPage from "./pages/ProductPage"
import LoginPage from "./pages/admin/LoginPage"
import DashboardPage from "./pages/admin/DashboardPage"
import CategoriesPage from "./pages/admin/CategoriesPage"
import ProductsPage from "./pages/admin/ProductsPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/admin/ProfilePage"
import SuperadminPage from "./pages/admin/SuperadminPage"
import QRCodePage from "./pages/admin/QRCodePage"
import RecipesPage from "./pages/admin/RecipesPage"
import SubcategoriesPage from "./pages/admin/SubcategoriesPage"
import HorarioPage from "./pages/admin/Horario/Horario"
import EmpleadosPage from "./pages/admin/Empleados/Empleados"

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/admin/login")
        return
      }
      try {
        await getProfile()
        setAuthorized(true)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    validateSession()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Verificando sesión...
      </div>
    )
  }

  if (!authorized) return null

  return children
}

// Rutas del router extraídas a su propio componente: AnimatePresence
// necesita "ver" el cambio de ruta vía useLocation, y useLocation solo
// funciona dentro de BrowserRouter, no en el mismo nivel que lo declara.
function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/superadmin" element={<SuperadminPage />} />

        <Route path="/:slug" element={<MenuPage />} />
        <Route path="/:slug/:categoryId" element={<CategoryPage />} />
        <Route path="/:slug/:categoryId/:productId" element={<ProductPage />} />
        <Route path="/admin/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin/qr" element={<PrivateRoute><QRCodePage /></PrivateRoute>} />
        <Route path="/admin/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/admin/horario" element={<PrivateRoute><HorarioPage /></PrivateRoute>} />
        <Route path="/admin/empleados" element={<PrivateRoute><EmpleadosPage /></PrivateRoute>} />
        <Route path="/admin/categories/:categoryId/subcategories" element={<PrivateRoute><SubcategoriesPage /></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App