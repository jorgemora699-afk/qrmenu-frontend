function ProductPrice({ price }) {
  return (
    <div className="product-price-container">
      <span className="product-price-big">
        ${Number(price).toLocaleString("es-CO")}
      </span>
    </div>
  )
}

export default ProductPrice