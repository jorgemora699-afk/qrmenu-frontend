import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  moveCategoryUp,
  moveCategoryDown
} from "../../services/api"

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

        <div className="add-form-image-row">

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

      </div>

      <div className="items-list">

        {categories.map((cat) => (

          <div
            key={cat.id}
            className="item-row"
          >

            {editingId === cat.id ? (

              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%"
                  }}
                >
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                    autoFocus
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingImage(e.target.files[0])}
                  />

                  <img
                    src={
                      editingImage
                        ? URL.createObjectURL(editingImage)
                        : cat.image_url
                    }
                    alt="Vista previa"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 12,
                      display: editingImage || cat.image_url ? "block" : "none"
                    }}
                  />

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn-save"
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
                    className="btn-order"
                    onClick={() => handleMoveUp(cat.id)}
                    title="Subir"
                  >
                    ⬆️
                  </button>

                  <button
                    className="btn-order"
                    onClick={() => handleMoveDown(cat.id)}
                    title="Bajar"
                  >
                    ⬇️
                  </button>

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