import { BrowserRouter, Routes, Route, Navigate, useEffect } from "react-router-dom"
import MenuPage from "./pages/MenuPage"
import CategoryPage from "./pages/CategoryPage"
import ProductPage from "./pages/ProductPage"
import LoginPage from "./pages/admin/LoginPage"
import DashboardPage from "./pages/admin/DashboardPage"
import CategoriesPage from "./pages/admin/CategoriesPage"
import ProductsPage from "./pages/admin/ProductsPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/admin/ProfilePage"

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate("/admin/login")
  }, [])

  if (!token) return null
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/:slug" element={<MenuPage />} />
        <Route path="/:slug/:categoryId" element={<CategoryPage />} />
        <Route path="/:slug/:categoryId/:productId" element={<ProductPage />} />
        <Route path="/admin/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App