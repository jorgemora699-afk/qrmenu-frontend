const IconFolderPlaceholder = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M3 7.5a2 2 0 0 1 2-2h4.2l1.6 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" opacity="0.16" />
    <path d="M3 7.5a2 2 0 0 1 2-2h4.2l1.6 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

const IconDishPlaceholder = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.16" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

function ProductCard({ product, onClick, isCategory = false }) {
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
            {isCategory ? <IconFolderPlaceholder /> : <IconDishPlaceholder />}
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

          {!isCategory && (
            <span className="product-price price-mono">
              ${Number(product.price).toLocaleString("es-CO", {
                maximumFractionDigits: 0,
              })}
            </span>
          )}

          {isCategory ? (
            <span className="product-arrow">
              →
            </span>
          ) : product.available === false ? (
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