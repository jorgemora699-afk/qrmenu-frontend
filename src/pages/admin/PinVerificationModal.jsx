import { useState, useEffect } from "react"
import { verifyRecipePin } from "../../services/api"

function PinVerificationModal({
  open,
  onClose,
  onSuccess
}) {
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setPin("")
      setError("")
      setLoading(false)
    }
  }, [open])

  if (!open) return null

  const handleConfirm = async () => {
    if (pin.length !== 4) return

    setLoading(true)
    setError("")

    try {
      await verifyRecipePin(pin)

      onSuccess()

      onClose()

    } catch (err) {
      setError(err.response?.data?.error || "PIN incorrecto")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        <span className="add-card-label">
          Verificación
        </span>

        <h3>Ingresa el PIN</h3>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          className="pin-input"
          value={pin}
          autoFocus
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ""))
          }
          onKeyDown={(e) =>
            e.key === "Enter" && handleConfirm()
          }
        />

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <div className="modal-actions">

          <button
            className="btn-primary"
            disabled={pin.length !== 4 || loading}
            onClick={handleConfirm}
          >
            {loading ? "Verificando..." : "Confirmar"}
          </button>

          <button
            className="btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  )
}

export default PinVerificationModal