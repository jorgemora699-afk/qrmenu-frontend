import { useNavigate } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { toPng } from "html-to-image"
import { getProfile } from "../../services/api"

function QRCodePage() {
  const navigate = useNavigate()
  const qrRef = useRef(null)

  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then((res) => {
      setBusiness(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading">Cargando...</div>

  const menuUrl = `https://qrmenu-frontend-roan.vercel.app/${business.slug}`

  const handleDownload = async () => {
    if (!qrRef.current) return

    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3
      })

      const link = document.createElement("a")
      link.download = `${business.slug}-qr.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

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

          <h2>Código QR</h2>

          <p>
            Descarga este código e imprímelo para colocarlo en las mesas.
          </p>

        </div>

      </div>

      <div className="qr-card" ref={qrRef}>

            <div className="qr-badge-head">
              {business.logo_url ? (
                <img
                    src={business.logo_url}
                    alt={business.name}
                    className="qr-logo"
                />
              ) : (
                <span className="qr-logo qr-logo-empty">🍽</span>
              )}
            </div>

            <h2 className="qr-name">
              {business.name}
            </h2>

            <div className="qr-container">
                <QRCode
                    value={menuUrl}
                    size={280}
                />
            </div>

            <span className="qr-badge">
                MENÚ
            </span>

      </div>

      <div className="qr-buttons">

        <button
          className="btn-primary"
          onClick={handleDownload}
        >
          Descargar PNG
        </button>

        <button
          className="btn-edit"
          onClick={handlePrint}
        >
          Imprimir
        </button>

      </div>

    </div>
  )
}

export default QRCodePage