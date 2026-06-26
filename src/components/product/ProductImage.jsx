function ProductImage({ src, alt }) {
  if (!src) return null

  return (
    <img
      src={src}
      alt={alt}
      className="product-image"
    />
  )
}

export default ProductImage