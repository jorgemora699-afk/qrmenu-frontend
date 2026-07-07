function ProductImage({ src, alt, fallbackSrc }) {
  const imageSrc = src || fallbackSrc

  if (!imageSrc) {
    return (
      <div className="product-image-placeholder">
        🍽
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="product-image"
    />
  )
}

export default ProductImage