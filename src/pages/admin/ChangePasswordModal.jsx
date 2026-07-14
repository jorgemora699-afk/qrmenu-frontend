import { useState } from "react"
import { changePassword } from "../../services/api"

function ChangePasswordModal({ open, onClose }) {

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

        <input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="modal-actions">

          <button
            className="btn-cancel"
            onClick={onClose}
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