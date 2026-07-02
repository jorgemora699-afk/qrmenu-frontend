import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories, getProducts, createProduct, updateProduct, deleteProduct, uploadImage  } from "../../services/api"

function ProductsPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: "", description: "", price: "", image_url: "", available: true, category_id: ""
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    const res = await getCategories()

    setCategories(res.data)

    if (res.data.length > 0) {
      setSelectedCategory(String(res.data[0].id))
    }

    setLoading(false)
  }

  const fetchProducts = async () => {

      if (!selectedCategory) return

      const res = await getProducts(selectedCategory)

      setProducts(res.data)

  }

  const openCreate = () => {
    setEditingProduct(null)
    setForm({ name: "", description: "", price: "", image_url: "", available: true, category_id: categories[0]?.id || "" })
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      available: product.available,
      category_id: product.category_id
    })
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.category_id) return
    const data = { ...form, price: parseFloat(form.price) }
    if (editingProduct) {
      await updateProduct(editingProduct.id, data)
    } else {
      await createProduct(data)
    }
    setShowForm(false)
    fetchProducts()
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return
    await deleteProduct(id)
    fetchProducts()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
        const res = await uploadImage(file)
        setForm({ ...form, image_url: res.data.url })
    } finally {
        setUploading(false)
    }
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/admin")}>← Volver</button>
          <h2>Productos</h2>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Agregar</button>
      </div>

      <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
      >

          {categories.map((cat) => (
              <option
                  key={cat.id}
                  value={cat.id}
              >
                  {cat.name}
              </option>
          ))}

      </select>

      <div className="upload-area">
        {form.image_url && (
            <img src={form.image_url} alt="Producto" className="logo-preview" />
        )}
        <label className="upload-btn">
            {uploading ? "Subiendo..." : form.image_url ? "Cambiar imagen" : "Subir imagen"}
            <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={uploading}
            />
        </label>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProduct ? "Editar producto" : "Nuevo producto"}</h3>

            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
            <input
              placeholder="Precio"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              placeholder="URL de imagen"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Disponible
            </label>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSubmit}>
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage