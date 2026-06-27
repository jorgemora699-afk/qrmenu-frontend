function ProductImage({ src, alt }) {
  if (!src) {
    return (
      <div className="product-image-placeholder">
        🍽
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="product-image"
    />
  )
}

export default ProductImage