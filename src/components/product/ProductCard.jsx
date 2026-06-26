function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="product-thumb"
        />
      )}

      <div className="product-info">
        <span className="product-name">
          {product.name}
        </span>

        <span className="product-price">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export default ProductCard