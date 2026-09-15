import axios from "axios"

const BASE_URL = "https://menunegocio-production.up.railway.app"

const api = axios.create({
  baseURL: BASE_URL
})

/* Agrega automáticamente el token a todas las peticiones */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* Si el backend responde 401, cerrar sesión automáticamente */
api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("token")
      localStorage.removeItem("business")

      if (window.location.pathname !== "/admin/login") {

        alert("Tu sesión ha expirado. Debes iniciar sesión nuevamente.")

        window.location.href = "/admin/login"

      }

    }

    return Promise.reject(error)

  }
)

export const getMenu = (slug) =>
  axios.get(`${BASE_URL}/api/menu/${slug}`)

export const getCategory = (slug, categoryId) =>
  axios.get(`${BASE_URL}/api/menu/${slug}/category/${categoryId}`)

export const login = (email, password) =>
  api.post("/api/auth/login", { email, password })

export const verifyRecipePin = (pin) =>
  api.post("/api/recipes/verify-pin", { pin })

export const changePassword = (current_password, new_password) =>
  api.put("/api/auth/change-password", { current_password, new_password })

export const changePin = (current_pin, new_pin) =>
  api.put("/api/auth/change-pin", { current_pin, new_pin })

export const getCategories = () =>
  api.get("/api/categories/")

export const createCategory = (data) =>
  api.post("/api/categories/", data)

export const updateCategory = (id, data) =>
  api.put(`/api/categories/${id}`, data)

export const deleteCategory = (id) =>
  api.delete(`/api/categories/${id}`)

export const moveCategoryUp = (id) =>
  api.put(`/api/categories/${id}/move-up`)

export const moveCategoryDown = (id) =>
  api.put(`/api/categories/${id}/move-down`)

export const getCategoryChildren = (categoryId) =>
  api.get(`/api/categories/${categoryId}/children`)

export const getProducts = (category_id) =>
  api.get("/api/products/", {
    params: category_id ? { category_id } : {}
  })

export const verificarPinHorario = (slug, pin) =>
  axios.post(`${BASE_URL}/api/horarios/verificar-pin`, { slug, pin })

export const listarEmpleadosHorario = (token) =>
  axios.get(`${BASE_URL}/api/horarios/empleados`, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const obtenerEstadoTurno = (token, empleadoId) =>
  axios.get(`${BASE_URL}/api/horarios/estado`, {
    params: { empleado_id: empleadoId },
    headers: { Authorization: `Bearer ${token}` }
  })

export const marcarEntradaHorario = (token, empleadoId) =>
  axios.post(`${BASE_URL}/api/horarios/entrada`, { empleado_id: empleadoId }, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const marcarSalidaHorario = (token, empleadoId) =>
  axios.post(`${BASE_URL}/api/horarios/salida`, { empleado_id: empleadoId }, {
    headers: { Authorization: `Bearer ${token}` }
  })

export const createProduct = (data) =>
  api.post("/api/products/", data)

export const updateProduct = (id, data) =>
  api.put(`/api/products/${id}`, data)

export const deleteProduct = (id) =>
  api.delete(`/api/products/${id}`)

export const moveProductUp = (id) =>
  api.put(`/api/products/${id}/move-up`)

export const moveProductDown = (id) =>
  api.put(`/api/products/${id}/move-down`)

export const getProfile = () =>
  api.get("/api/profile/")

export const updateProfile = (data) =>
  api.put("/api/profile/", data)

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append("file", file)


  return api.post("/api/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const searchRecipeProducts = (q) =>
  api.get("/api/recipes/search", { params: { q } })

export const getRecipe = (productId) =>
  api.get(`/api/recipes/product/${productId}`)

export const saveRecipe = (productId, data) =>
  api.put(`/api/recipes/product/${productId}`, data)

export const getEmpleados = () =>
  api.get("/api/empleados/")

export const createEmpleado = (data) =>
  api.post("/api/empleados/", data)

export const updateEmpleado = (id, data) =>
  api.put(`/api/empleados/${id}`, data)

export const deleteEmpleado = (id) =>
  api.delete(`/api/empleados/${id}`)

export const calcularSalariosEmpleados = (desde, hasta) =>
  api.get("/api/empleados/salarios", { params: { desde, hasta } })

export const listarTurnosEmpleado = (empleadoId, desde, hasta) =>
  api.get(`/api/empleados/${empleadoId}/turnos`, { params: { desde, hasta } })

export const actualizarTurno = (turnoId, data) =>
  api.put(`/api/empleados/turnos/${turnoId}`, data)

export const generarPdfEmpleado = (empleadoId, desde, hasta) =>
  api.get(`/api/empleados/${empleadoId}/pdf`, {
    params: { desde, hasta },
    responseType: "blob",
  })

  export const generarReporteGeneralPdf = (desde, hasta) =>
  api.get("/api/empleados/reporte-general/pdf", {
    params: { desde, hasta },
    responseType: "blob",
  })

  export const getTarifaGeneral = () =>
  api.get("/api/empleados/tarifa-general")

  export const updateTarifaGeneral = (data) =>
    api.put("/api/empleados/tarifa-general", data)