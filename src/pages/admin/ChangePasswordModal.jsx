import { useState } from "react"
import { changePassword } from "../../services/api"

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.36" />
    <path d="M1 1l22 22" />
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
  </svg>
)

function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Completa todos los campos.")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.")
      return
    }

    try {
      setLoading(true)

      await changePassword(currentPassword, newPassword)

      alert("Contraseña actualizada correctamente.")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setShowCurrent(false)
      setShowNew(false)
      setShowConfirm(false)

      onClose()
    } catch (error) {
      alert(
        error.response?.data?.error ||
        "No fue posible cambiar la contraseña."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Cambiar contraseña</h3>

        <div className="password-input">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowCurrent(!showCurrent)}
            >
            {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="password-input">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowNew(!showNew)}
            >
            {showNew ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="password-input">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm(!showConfirm)}
            >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="modal-actions">

          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default ChangePasswordModal