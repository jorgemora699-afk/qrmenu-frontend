import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { searchRecipeProducts, getRecipe, saveRecipe, verifyRecipePin } from "../../services/api"
import Loading from "../../components/common/Loading"


function RecipesPage() {
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [loadingRecipe, setLoadingRecipe] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editIngredients, setEditIngredients] = useState("")
  const [editProcedure, setEditProcedure] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  const [showPinModal, setShowPinModal] = useState(false)
  const [pinValue, setPinValue] = useState("")
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState("")

  const debounceRef = useRef(null)
  const skipSearchRef = useRef(false)

  useEffect(() => {
    if (skipSearchRef.current) {
        skipSearchRef.current = false
        return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
        setResults([])
        return
    }

    debounceRef.current = setTimeout(async () => {
        setSearching(true)
        try {
        const res = await searchRecipeProducts(query.trim())
        setResults(res.data)
        } finally {
        setSearching(false)
        }
    }, 300)

    return () => clearTimeout(debounceRef.current)
    }, [query])

  const handleSelectProduct = async (product) => {
    skipSearchRef.current = true
    setSelectedProduct(product)
    setQuery(product.name)
    setResults([])
    setEditing(false)
    setLoadingRecipe(true)

    try {
        const res = await getRecipe(product.id)
        setRecipe(res.data)
    } finally {
        setLoadingRecipe(false)
    }
  }

  const openEdit = () => {
    setEditIngredients(recipe?.ingredients || "")
    setEditProcedure(recipe?.procedure || "")
    setPinValue("")
    setPin("")
    setPinError("")
    setShowPinModal(true)
  }

  const confirmPin = async () => {
    if (pinValue.length !== 4) return

    setPinError("")

    try {
        await verifyRecipePin(pinValue)

        setPin(pinValue)
        setShowPinModal(false)
        setEditing(true)

    } catch (err) {
        setPinError(err.response?.data?.error || "PIN incorrecto")
        setPinValue("")
    }
  }

  const handleSave = async () => {
    if (!selectedProduct) return

    setSaving(true)
    setSaveError("")

    try {
      await saveRecipe(selectedProduct.id, {
        pin,
        ingredients: editIngredients,
        procedure: editProcedure
      })

      setRecipe({
        ...recipe,
        ingredients: editIngredients,
        procedure: editProcedure,
        has_recipe: true
      })

      setEditing(false)
      setPin("")
    } catch (err) {
      setSaveError(err.response?.data?.error || "Error al guardar la receta")

      if (err.response?.status === 403) {
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const ingredientLines = (recipe?.ingredients || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="admin-page">

      <header className="panel-header">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>

        <div className="panel-header-top">
          <h2 className="panel-title">Recetas</h2>
        </div>

        <div className="panel-rule" />
        <p className="panel-hint">Busca un producto para ver su preparación</p>
      </header>

      <div className="recipe-search-wrap">
        <input
          className="recipe-search-input"
          placeholder="Escribe el nombre del producto..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedProduct(null)
            setRecipe(null)
            setEditing(false)
          }}
        />

        {query && (
            <button
            className="recipe-search-clear"
            onClick={() => {
                setQuery("")
                setResults([])
                setSelectedProduct(null)
                setRecipe(null)
                setEditing(false)
            }}
            >
            ✕
            </button>
        )}

        {results.length > 0 && (
          <ul className="recipe-search-results">
            {results.map((p) => (
              <li
                key={p.id}
                className="recipe-search-result-item"
                onClick={() => handleSelectProduct(p)}
              >
                <span className="recipe-result-name">{p.name}</span>
                <span className="recipe-result-category">{p.category_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loadingRecipe && <Loading />}

      {selectedProduct && recipe && !loadingRecipe && (

        editing ? (

          <section className="profile-card">
            <span className="add-card-label">Editando: {selectedProduct.name}</span>

            <div className="form-field">
              <label>Ingredientes (uno por línea)</label>
              <textarea
                className="recipe-textarea"
                rows={6}
                value={editIngredients}
                onChange={(e) => setEditIngredients(e.target.value)}
                placeholder={"200g de queso mozzarella\n1 tomate mediano\n..."}
              />
            </div>

            <div className="form-field">
              <label>Procedimiento</label>
              <textarea
                className="recipe-textarea"
                rows={8}
                value={editProcedure}
                onChange={(e) => setEditProcedure(e.target.value)}
                placeholder="Describe paso a paso la preparación..."
              />
            </div>

            {saveError && <div className="error-msg">{saveError}</div>}

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar receta"}
              </button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </section>

        ) : (

          <section className="profile-card recipe-view-card">

            <div className="recipe-view-header">
              <h3 className="recipe-view-title">{selectedProduct.name}</h3>
              <button className="btn-edit" onClick={openEdit}>
                {recipe.has_recipe ? "Editar" : "Agregar receta"}
              </button>
            </div>

            {recipe.image_url && (
                <div className="recipe-image-wrap">

                    <img
                        src={recipe.image_url}
                        alt=""
                        className="recipe-image-bg"
                    />

                    <img
                        src={recipe.image_url}
                        alt={selectedProduct.name}
                        className="recipe-image"
                    />

                </div>
            )}

            {!recipe.has_recipe ? (
              <div className="empty-state">
                Este producto todavía no tiene receta registrada.
              </div>
            ) : (
              <>
                <div className="recipe-section">
                  <span className="add-card-label">Ingredientes</span>
                  <ul className="recipe-ingredients-list">
                    {ingredientLines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section">
                  <span className="add-card-label">Procedimiento</span>
                  <p className="recipe-procedure-text">{recipe.procedure}</p>
                </div>
              </>
            )}

          </section>
        )
      )}

      {showPinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="add-card-label">Verificación</span>
            <h3>Ingresa el PIN para editar</h3>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="pin-input"
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && confirmPin()}
              autoFocus
            />

            {pinError && (
                <div className="error-msg">
                    {pinError}
                </div>
            )}

            <div className="modal-actions">
              <button className="btn-primary" onClick={confirmPin} disabled={pinValue.length !== 4}>
                Confirmar
              </button>
              <button className="btn-cancel" onClick={() => setShowPinModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default RecipesPage