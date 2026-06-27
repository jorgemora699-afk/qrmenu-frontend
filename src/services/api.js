import axios from "axios"

const BASE_URL = "https://menunegocio-production.up.railway.app"

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getMenu = (slug) => axios.get(`${BASE_URL}/api/menu/${slug}`)

export const login = (email, password) =>
  api.post("/api/auth/login", { email, password })

export const getCategories = () => api.get("/api/categories/")
export const createCategory = (data) => api.post("/api/categories/", data )
export const updateCategory = (id, data) => api.put(`/api/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`)

export const getProducts = (category_id) =>
  api.get("/api/products/", { params: category_id ? { category_id } : {} })
export const createProduct = (data) => api.post("/api/products/", data)
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/api/products/${id}`)

export const getProfile = () => api.get("/api/profile/")
export const updateProfile = (data) => api.put("/api/profile/", data)

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return api.post("/api/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}