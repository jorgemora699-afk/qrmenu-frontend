import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCategories,
  getCategoryChildren,
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategoryUp,
  moveCategoryDown
} from "../../services/api"

function SubcategoriesPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subcategories, setSubcategories] = useState([])

  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")

  const [loading, setLoading] = useState(true)

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
      await createCategory({
        parent_id: Number(selectedCategory),
        name: newName
      })

      setNewName("")
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
      alert("No se pudo crear la subcategoría.")
    }
  }

  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, {
        name: editingName
      })

      setEditingId(null)
      setEditingName("")
      fetchSubcategories(selectedCategory)
    } catch (err) {
      console.error(err)
      alert("No se pudo actualizar la subcategoría.")
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

        </div>

        <button
          className="btn-primary"
          onClick={handleCreate}
        >
          Agregar
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
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />

                  <button
                    className="btn-primary"
                    onClick={() => handleUpdate(sub.id)}
                  >
                    Guardar
                  </button>

                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setEditingId(null)
                      setEditingName("")
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="ledger-index">
                    {index + 1}
                  </span>

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