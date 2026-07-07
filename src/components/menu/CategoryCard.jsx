function CategoryCard({ category, index, onClick }) {
  return (
    <button className="category-card" onClick={onClick}>

      <span className="category-index">
        {String(index + 1).padStart(2, "0")}
      </span>

      {category.image_url ? (
        <img
          src={category.image_url}
          alt={category.name}
          className="category-image"
        />
      ) : (
        <span className="category-emoji">
          {category.emoji || "🍽"}
        </span>
      )}

      <div className="category-info">
        <span className="category-name">
          {category.name}
        </span>

        <span className="category-count">
          {category.products.length} {category.products.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      <span className="category-arrow">
        →
      </span>

    </button>
  )
}

export default CategoryCard