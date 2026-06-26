import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories, getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api"

function ProductsPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
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
    setLoading(false)
  }

  const fetchProducts = async () => {
    const res = await getProducts(selectedCategory || null)
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
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="items-list">
        {products.map((product) => (
          <div key={product.id} className="product-admin-row">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="product-thumb" />
            )}
            <div className="product-admin-info">
              <span className="item-name">{product.name}</span>
              <span className="product-price">${parseFloat(product.price).toLocaleString()}</span>
              <span className={product.available ? "badge-available" : "badge-unavailable"}>
                {product.available ? "Disponible" : "No disponible"}
              </span>
            </div>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => openEdit(product)}>Editar</button>
              <button className="btn-delete" onClick={() => handleDelete(product.id)}>Eliminar</button>
            </div>
          </div>
        ))}
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