import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCategories,
  getCategoryChildren,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  moveCategoryUp,
  moveCategoryDown
} from "../../services/api"

/* ---------- iconos (trazo fino, sin dependencias externas) ---------- */

const IconImage = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const IconFolder = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
)

function SubcategoriesPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subcategories, setSubcategories] = useState([])

  const [newName, setNewName] = useState("")
  const [newImage, setNewImage] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [editingImage, setEditingImage] = useState(null)
  const [editingParentId, setEditingParentId] = useState("")

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory)
    }
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()

      setCategories(res.data)

      if (res.data.length > 0) {
        setSelectedCategory(String(res.data[0].id))
      }
    } catch (err) {
      console.error(err)
      alert("No se pudieron cargar las categorías.")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await getCategoryChildren(categoryId)
      setSubcategories(res.data)
    } catch (err) {
      console.error(err)
      setSubcategories([])
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return

    try {
      setUploading(true)

      let image_url = null

      if (newImage) {
        const upload = await uploadImage(newImage)
        image_url = upload.data.url
      }

      await createCategory({
        parent_id: Number(selectedCategory),
        name: newName.trim(),
        image_url
      })

      setNewName("")
      setNewImage(null)
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
      alert("No se pudo crear la subcategoría.")
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return

    try {
      setSavingEdit(true)

      const payload = {
        name: editingName.trim(),
        parent_id: editingParentId ? Number(editingParentId) : null
      }

      if (editingImage) {
        const upload = await uploadImage(editingImage)
        payload.image_url = upload.data.url
      }

      await updateCategory(id, payload)

      setEditingId(null)
      setEditingImage(null)
      setEditingParentId("")
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
      alert("No se pudo actualizar la subcategoría.")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta subcategoría?")) return

    try {
      await deleteCategory(id)
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
      alert("No se pudo eliminar.")
    }
  }

  const moveUp = async (id) => {
    try {
      await moveCategoryUp(id)
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
    }
  }

  const moveDown = async (id) => {
    try {
      await moveCategoryDown(id)
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="admin-page">

      <header className="panel-header">

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Volver
        </button>

        <div className="panel-header-top">
          <h2 className="panel-title">Subcategorías</h2>
        </div>

      </header>

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

      <section className="add-card">

        <span className="add-card-label">
          Nueva subcategoría
        </span>

        <div className="add-card-row">

          <input
            value={newName}
            placeholder="Ej. Empanadas x6"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate()
              }
            }}
          />

          <label className="thumb-picker">
            {newImage ? (
              <img
                className="thumb-picker-preview"
                src={URL.createObjectURL(newImage)}
                alt="Vista previa"
              />
            ) : (
              <IconImage />
            )}
            <span>{newImage ? "Cambiar" : "Imagen"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </label>

        </div>

        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Agregar"}
        </button>

      </section>

      {subcategories.length === 0 ? (
        <div className="empty-state">
          No hay subcategorías en esta categoría.
        </div>
      ) : (
        <ol className="menu-ledger">

          {subcategories.map((sub, index) => (

            <li
              key={sub.id}
              className="ledger-row"
            >

              {editingId === sub.id ? (
                <div className="ledger-edit-form">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(sub.id)}
                    autoFocus
                  />

                  <label className="thumb-picker">
                    {(editingImage || sub.image_url) ? (
                      <img
                        className="thumb-picker-preview"
                        src={editingImage ? URL.createObjectURL(editingImage) : sub.image_url}
                        alt="Vista previa"
                      />
                    ) : (
                      <IconImage />
                    )}
                    <span>Cambiar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingImage(e.target.files[0])}
                    />
                  </label>

                  <div className="parent-select-card">
                    <span className="add-card-label parent-select-label">
                      <IconFolder />
                      Categoría padre
                    </span>
                    <select
                      className="filter-select"
                      value={editingParentId}
                      onChange={(e) => setEditingParentId(e.target.value)}
                    >
                      <option value="">— Categoría principal (sin padre) —</option>
                      {categories
                        .filter((c) => c.id !== sub.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="ledger-edit-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdate(sub.id)}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setEditingId(null)
                        setEditingImage(null)
                        setEditingParentId("")
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="ledger-index">
                    {index + 1}
                  </span>

                  {sub.image_url ? (
                    <img
                      className="ledger-thumb"
                      src={sub.image_url}
                      alt={sub.name}
                    />
                  ) : (
                    <span className="ledger-thumb-placeholder">🍽</span>
                  )}

                  <span className="ledger-name">
                    {sub.name}
                  </span>

                  <div className="ledger-actions">

                    <button
                      className="icon-btn"
                      onClick={() => moveUp(sub.id)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => moveDown(sub.id)}
                      disabled={index === subcategories.length - 1}
                    >
                      ↓
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => {
                        setEditingId(sub.id)
                        setEditingName(sub.name)
                        setEditingParentId(String(selectedCategory))
                      }}
                    >
                      ✎
                    </button>

                    <button
                      className="icon-btn icon-btn-danger"
                      onClick={() => handleDelete(sub.id)}
                    >
                      🗑
                    </button>

                  </div>
                </>
              )}

            </li>

          ))}

        </ol>
      )}

    </div>
  )
}

export default SubcategoriesPage