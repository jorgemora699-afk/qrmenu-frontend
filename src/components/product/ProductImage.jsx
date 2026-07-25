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
    <div className="product-image-frame">
      <div
        className="product-image-backdrop"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <img
        src={imageSrc}
        alt={alt}
        className="product-image"
      />
    </div>
  )
}

export default ProductImage