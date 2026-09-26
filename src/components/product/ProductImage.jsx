import { motion } from "framer-motion"

const IconDishPlaceholder = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
  </svg>
)

function ProductImage({ src, alt, fallbackSrc, productId }) {
  const imageSrc = src || fallbackSrc

  if (!imageSrc) {
    return (
      <div className="product-image-placeholder">
        <IconDishPlaceholder />
      </div>
    )
  }

  return (
    <div className="product-image-frame">
      <div
        className="product-image-backdrop"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <motion.img
        layoutId={`product-image-${productId}`}
        src={imageSrc}
        alt={alt}
        className="product-image"
      />
    </div>
  )
}

export default ProductImage