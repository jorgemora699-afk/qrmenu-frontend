function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>

      <div className="product-image-container">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-thumb"
          />
        ) : (
          <div className="product-placeholder">
            🍽
          </div>
        )}
      </div>

      <div className="product-info">

        <h3 className="product-name">
          {product.name}
        </h3>

        {product.description && (
          <p className="product-description-small">
            {product.description}
          </p>
        )}

        <div className="product-footer">

          <span className="product-price price-mono">
            ${Number(product.price).toLocaleString("es-CO", { maximumFractionDigits: 0 })}
          </span>
          {product.available === false ? (
            <span className="availability-pill availability-pill-off">
              Agotado
            </span>
          ) : (
            <span className="product-arrow">
              →
            </span>
          )}

        </div>

      </div>

    </div>
  )
}

export default ProductCard