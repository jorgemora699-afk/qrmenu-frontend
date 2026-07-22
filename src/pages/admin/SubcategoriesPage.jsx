import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  moveSubcategoryUp,
  moveSubcategoryDown
} from "../../services/api"

function SubcategoriesPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams()

  const [subcategories, setSubcategories] = useState([])
  const [newName, setNewName] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubcategories()
  }, [])

  const fetchSubcategories = async () => {
    try {
      const res = await getSubcategories(categoryId)
      setSubcategories(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return

    await createSubcategory({
      category_id: categoryId,
      name: newName
    })

    setNewName("")
    fetchSubcategories()
  }

  const handleUpdate = async (id) => {
    await updateSubcategory(id, {
      name: editingName
    })

    setEditingId(null)
    fetchSubcategories()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta subcategoría?")) return

    await deleteSubcategory(id)
    fetchSubcategories()
  }

  const moveUp = async (id) => {
    await moveSubcategoryUp(id)
    fetchSubcategories()
  }

  const moveDown = async (id) => {
    await moveSubcategoryDown(id)
    fetchSubcategories()
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="admin-page">

      <header className="panel-header">

        <button
          className="back-btn"
          onClick={() => navigate("/admin/categories")}
        >
          ← Volver
        </button>

        <div className="panel-header-top">
          <h2 className="panel-title">Subcategorías</h2>
        </div>

      </header>

      <section className="add-card">

        <span className="add-card-label">
          Nueva subcategoría
        </span>

        <div className="add-card-row">

          <input
            value={newName}
            placeholder="Ej. Empanadas x6"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter" && handleCreate()}
          />

        </div>

        <button
          className="btn-primary"
          onClick={handleCreate}
        >
          Agregar
        </button>

      </section>

      <ol className="menu-ledger">

        {subcategories.map((sub,index)=>(

          <li
            key={sub.id}
            className="ledger-row"
          >

            {editingId===sub.id ? (

              <>
                <input
                  value={editingName}
                  onChange={(e)=>setEditingName(e.target.value)}
                />

                <button
                  className="btn-primary"
                  onClick={()=>handleUpdate(sub.id)}
                >
                  Guardar
                </button>

                <button
                  className="btn-cancel"
                  onClick={()=>setEditingId(null)}
                >
                  Cancelar
                </button>
              </>

            ) : (

              <>
                <span className="ledger-index">
                  {index+1}
                </span>

                <span className="ledger-name">
                  {sub.name}
                </span>

                <div className="ledger-actions">

                  <button
                    className="icon-btn"
                    onClick={()=>moveUp(sub.id)}
                    disabled={index===0}
                  >
                    ↑
                  </button>

                  <button
                    className="icon-btn"
                    onClick={()=>moveDown(sub.id)}
                    disabled={index===subcategories.length-1}
                  >
                    ↓
                  </button>

                  <button
                    className="icon-btn"
                    onClick={()=>{
                      setEditingId(sub.id)
                      setEditingName(sub.name)
                    }}
                  >
                    ✎
                  </button>

                  <button
                    className="icon-btn icon-btn-danger"
                    onClick={()=>handleDelete(sub.id)}
                  >
                    🗑
                  </button>

                </div>

              </>
            )}

          </li>

        ))}

      </ol>

    </div>
  )
}

export default SubcategoriesPage