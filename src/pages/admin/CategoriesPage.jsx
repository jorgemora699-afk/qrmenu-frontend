import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage
} from "../../services/api"

function CategoriesPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState("")

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

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
      await updateCategory(id, {
        name: editingName
      })

      setEditingId(null)
      fetchCategories()
    } catch (err) {
      console.error(err)
      alert("Error al actualizar")
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

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin")}
          >
            ← Volver
          </button>

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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />

        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Vista previa"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 12,
              marginTop: 10
            }}
          />
        )}

        <button
          onClick={handleCreate}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Agregar"}
        </button>

      </div>

      <div className="items-list">

        {categories.map((cat) => (

          <div
            key={cat.id}
            className="item-row"
          >

            {editingId === cat.id ? (

              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  autoFocus
                />

                <button
                  className="btn-save"
                  onClick={() => handleUpdate(cat.id)}
                >
                  Guardar
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </button>
              </>

            ) : (

              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}
                >

                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 12
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 32
                      }}
                    >
                      🍽
                    </span>
                  )}

                  <span className="item-name">
                    {cat.name}
                  </span>

                </div>

                <div className="item-actions">

                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingId(cat.id)
                      setEditingName(cat.name)
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Eliminar
                  </button>

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