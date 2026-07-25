import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCategories,
  getCategoryChildren,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  moveProductUp,
  moveProductDown
} from "../../services/api"

/* ---------- iconos (trazo fino, sin dependencias externas) ---------- */

const IconChevronUp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

const IconChevronDown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const IconPencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

function ProductsPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [categoryTree, setCategoryTree] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [formError, setFormError] = useState("")
  const [showImageZoom, setShowImageZoom] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "", image_url: "", available: true, category_id: "", subcategory_id: ""
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  useEffect(() => {
    fetchSubcategories(form.category_id)
  }, [form.category_id])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      const cats = res.data

      const tree = await Promise.all(
        cats.map(async (cat) => {
          const childRes = await getCategoryChildren(cat.id)
          return { ...cat, children: childRes.data }
        })
      )

      setCategories(cats)
      setCategoryTree(tree)

      if (cats.length > 0) {
        setSelectedCategory(String(cats[0].id))
      }
    } catch (err) {
      console.error(err)
      alert("No se pudieron cargar las categorías.")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([])
      return
    }

    try {
      const res = await getCategoryChildren(categoryId)
      setSubcategories(res.data)
    } catch (err) {
      console.error(err)
      setSubcategories([])
    }
  }

  const fetchProducts = async () => {
    if (!selectedCategory) return

    try {
      const res = await getProducts(selectedCategory)
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      alert("No se pudieron cargar los productos.")
    }
  }

  const openCreate = async () => {
    setEditingProduct(null)
    setFormError("")

    await fetchSubcategories(selectedCategory)

    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      available: true,
      category_id: selectedCategory,
      subcategory_id: ""
    })

    setShowForm(true)
  }

  const openEdit = async (product) => {
    setEditingProduct(product)
    setFormError("")

    const isRoot = categories.some(
      (cat) => String(cat.id) === String(product.category_id)
    )

    let parentCategoryId = product.category_id
    let subcategoryId = ""

    if (!isRoot) {
      // el producto está en una subcategoría: hay que encontrar a qué
      // categoría raíz pertenece, buscando entre los hijos de cada una
      for (const cat of categories) {
        const res = await getCategoryChildren(cat.id)
        const match = res.data.find(
          (child) => String(child.id) === String(product.category_id)
        )
        if (match) {
          parentCategoryId = cat.id
          subcategoryId = product.category_id
          break
        }
      }
    }

    await fetchSubcategories(parentCategoryId)

    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      available: product.available,
      category_id: parentCategoryId,
      subcategory_id: subcategoryId
    })

    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setFormError("")
    setEditingProduct(null)
    setShowImageZoom(false)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio.")
      return
    }
    if (!form.price) {
      setFormError("El precio es obligatorio.")
      return
    }
    if (!form.category_id) {
      setFormError("Selecciona una categoría.")
      return
    }

    setFormError("")

    try {
      const { subcategory_id, ...rest } = form

      const data = {
        ...rest,
        price: parseFloat(form.price),
        category_id: subcategory_id || form.category_id
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await createProduct(data)
      }
      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
      setFormError("No se pudo guardar el producto. Intenta de nuevo.")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert("No se pudo eliminar el producto.")
    }
  }

  const handleMoveUp = async (id) => {
    try {
      await moveProductUp(id)
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert("No se pudo mover el producto.")
    }
  }

  const handleMoveDown = async (id) => {
    try {
      await moveProductDown(id)
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert("No se pudo mover el producto.")
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setForm((prev) => ({ ...prev, image_url: res.data.url }))
    } catch (err) {
      console.error(err)
      alert("No se pudo subir la imagen.")
    } finally {
      setUploading(false)
      e.target.value = "" // permite volver a subir el mismo archivo
    }
  }

  const handleRemoveImage = () => {
    if (!window.confirm("¿Quitar la imagen de este producto?")) return
    setForm((prev) => ({ ...prev, image_url: "" }))
  }

  const formatPrice = (price) => `$${Number(price).toLocaleString()}`

  const selectedCategoryName = categoryTree
    .flatMap((cat) => [cat, ...cat.children])
    .find((cat) => String(cat.id) === String(selectedCategory))?.name

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">

      <header className="panel-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>← Volver</button>

        <div className="panel-header-top">
          <h2 className="panel-title">Productos</h2>
          <button className="btn-primary" onClick={openCreate}>+ Agregar</button>
        </div>

        <div className="panel-rule" />
        <p className="panel-hint">
          {products.length} {products.length === 1 ? "producto" : "productos"}
          {selectedCategoryName ? ` en ${selectedCategoryName}` : ""}
        </p>
      </header>

      <select
        className="filter-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categoryTree.map((cat) => (
          <optgroup key={cat.id} label={cat.name}>
            <option value={cat.id}>{cat.name}</option>
            {cat.children.map((child) => (
              <option key={child.id} value={child.id}>
                &nbsp;&nbsp;↳ {child.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {products.length === 0 ? (
        <div className="empty-state">
          No hay productos en esta categoría todavía.
        </div>
      ) : (
        <ol className="menu-ledger">
          {products.map((product) => (
            <li key={product.id} className="ledger-row">

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="ledger-thumb"
                />
              ) : (
                <span className="ledger-thumb-placeholder">🍽</span>
              )}

              <div className="ledger-product-info">
                <span className="ledger-name">{product.name}</span>
                <div className="ledger-product-meta">
                  <span className="price-mono">{formatPrice(product.price)}</span>
                  <span className={`availability-pill ${product.available ? "availability-pill-on" : "availability-pill-off"}`}>
                    {product.available ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>

              <div className="ledger-actions">

                <button
                  className="icon-btn"
                  onClick={() => handleMoveUp(product.id)}
                  title="Subir"
                  aria-label="Subir producto"
                >
                  <IconChevronUp />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => handleMoveDown(product.id)}
                  title="Bajar"
                  aria-label="Bajar producto"
                >
                  <IconChevronDown />
                </button>

                <div className="ledger-divider" />

                <button
                  className="icon-btn"
                  onClick={() => openEdit(product)}
                  title="Editar"
                  aria-label="Editar producto"
                >
                  <IconPencil />
                </button>

                <button
                  className="icon-btn icon-btn-danger"
                  onClick={() => handleDelete(product.id)}
                  title="Eliminar"
                  aria-label="Eliminar producto"
                >
                  <IconTrash />
                </button>

              </div>
            </li>
          ))}
        </ol>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="add-card-label">
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </span>
            <h3>{editingProduct ? editingProduct.name : "Agrega un producto"}</h3>

            {formError && (
              <p className="form-error">{formError}</p>
            )}

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

            <div className="upload-area">
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Producto"
                  className="logo-preview"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => setShowImageZoom(true)}
                />
              )}

              <div className="upload-area-actions">
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

                {form.image_url && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    Quitar imagen
                  </button>
                )}
              </div>
            </div>

            <input
              placeholder="Precio"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value, subcategory_id: "" })
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {subcategories.length > 0 && (
              <select
                value={form.subcategory_id}
                onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}
              >
                <option value="">Sin subcategoría</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}

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
              <button className="btn-cancel" onClick={closeForm}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showImageZoom && form.image_url && (
        <div
          className="modal-overlay"
          onClick={() => setShowImageZoom(false)}
        >
          <button
            className="icon-btn"
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "#fff"
            }}
            onClick={() => setShowImageZoom(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <img
            src={form.image_url}
            alt="Producto en grande"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default ProductsPage