import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/api"

function CategoriesPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [loading, setLoading] = useState(true)

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
    await createCategory(newName.trim())
    setNewName("")
    fetchCategories()
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return
    await updateCategory(id, editingName.trim())
    setEditingId(null)
    fetchCategories()
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta categoría y todos sus productos?")) return
    await deleteCategory(id)
    fetchCategories()
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/admin")}>← Volver</button>
          <h2>Categorías</h2>
        </div>
      </div>

      <div className="add-form">
        <input
          placeholder="Nueva categoría..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button onClick={handleCreate}>Agregar</button>
      </div>

      <div className="items-list">
        {categories.map((cat) => (
          <div key={cat.id} className="item-row">
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  autoFocus
                />
                <button className="btn-save" onClick={() => handleUpdate(cat.id)}>Guardar</button>
                <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <span className="item-name">{cat.name}</span>
                <div className="item-actions">
                  <button className="btn-edit" onClick={() => { setEditingId(cat.id); setEditingName(cat.name) }}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(cat.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage