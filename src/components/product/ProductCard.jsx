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

          <span className="product-price">
            ${product.price.toLocaleString()}
          </span>

          <span className="product-arrow">
            →
          </span>

        </div>

      </div>

    </div>
  )
}

export default ProductCard