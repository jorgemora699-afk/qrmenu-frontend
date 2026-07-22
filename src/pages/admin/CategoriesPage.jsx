import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  moveCategoryUp,
  moveCategoryDown
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

const IconImage = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const IconFolder = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
)

function CategoriesPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [editingImage, setEditingImage] = useState(null)

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return

    try {
      setUploading(true)

      let image_url = null

      if (selectedImage) {
        const upload = await uploadImage(selectedImage)
        image_url = upload.data.url
      }

      await createCategory({
        name: newName.trim(),
        image_url
      })

      setNewName("")
      setSelectedImage(null)

      fetchCategories()

    } catch (err) {
      console.error(err)
      alert("Error al crear la categoría")
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return

    try {
      setSavingEdit(true)

      const payload = {
        name: editingName.trim()
      }

      if (editingImage) {
        const upload = await uploadImage(editingImage)
        payload.image_url = upload.data.url
      }

      await updateCategory(id, payload)

      setEditingId(null)
      setEditingImage(null)
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert("Error al actualizar")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría y todos sus productos?")) return

    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert("Error al eliminar")
    }
  }

  const handleMoveUp = async (id) => {
    try {
      await moveCategoryUp(id)
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert("No se pudo mover la categoría.")
    }
  }

  const handleMoveDown = async (id) => {
    try {
      await moveCategoryDown(id)
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert("No se pudo mover la categoría.")
    }
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">

      <header className="panel-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>

        <div className="panel-header-top">
          <h2 className="panel-title">Categorías</h2>
          <span className="panel-count">
            {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
          </span>
        </div>

        <div className="panel-rule" />
        <p className="panel-hint">El orden de esta lista es el orden que verán tus clientes en el menú</p>
      </header>

      <section className="add-card">
        <span className="add-card-label">Nueva categoría</span>

        <div className="add-card-row">
          <input
            placeholder="Ej. Entradas, Bebidas, Postres..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />

          <label className="thumb-picker">
            {selectedImage ? (
              <img
                className="thumb-picker-preview"
                src={URL.createObjectURL(selectedImage)}
                alt="Vista previa"
              />
            ) : (
              <IconImage />
            )}
            <span>{selectedImage ? "Cambiar" : "Imagen"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>
        </div>

        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Agregar categoría"}
        </button>
      </section>

      {categories.length === 0 ? (

        <div className="empty-state">
          Todavía no tienes categorías. Crea la primera arriba para empezar a organizar tu menú.
        </div>

      ) : (

        <ol className="menu-ledger">

          {categories.map((cat, index) => (

            <li key={cat.id} className="ledger-row">

              {editingId === cat.id ? (

                <div className="ledger-edit-form">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                    autoFocus
                  />

                  <label className="thumb-picker">
                    {(editingImage || cat.image_url) ? (
                      <img
                        className="thumb-picker-preview"
                        src={editingImage ? URL.createObjectURL(editingImage) : cat.image_url}
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

                  <div className="ledger-edit-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdate(cat.id)}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setEditingId(null)
                        setEditingImage(null)
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

              ) : (

                <>
                  <span className="ledger-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {cat.image_url ? (
                    <img
                      className="ledger-thumb"
                      src={cat.image_url}
                      alt={cat.name}
                    />
                  ) : (
                    <span className="ledger-thumb-placeholder">🍽</span>
                  )}

                  <span className="ledger-name">{cat.name}</span>

                  <div className="ledger-actions">
                    <button
                      className="icon-btn"
                      onClick={() => handleMoveUp(cat.id)}
                      disabled={index === 0}
                      title="Subir"
                      aria-label="Subir categoría"
                    >
                      <IconChevronUp />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => handleMoveDown(cat.id)}
                      disabled={index === categories.length - 1}
                      title="Bajar"
                      aria-label="Bajar categoría"
                    >
                      <IconChevronDown />
                    </button>

                    <div className="ledger-divider" />

                    <Link
                        to={`/admin/categories/${cat.id}/subcategories`}
                        className="icon-btn"
                        title="Subcategorías"
                    >
                        <IconFolder />
                    </Link>

                    <button
                      className="icon-btn"
                      onClick={() => {
                        setEditingId(cat.id)
                        setEditingName(cat.name)
                      }}
                      title="Editar"
                      aria-label="Editar categoría"
                    >
                      <IconPencil />
                    </button>

                    <button
                      className="icon-btn icon-btn-danger"
                      onClick={() => handleDelete(cat.id)}
                      title="Eliminar"
                      aria-label="Eliminar categoría"
                    >
                      <IconTrash />
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

export default CategoriesPage