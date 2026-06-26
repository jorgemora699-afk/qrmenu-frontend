function CategoryCard({ category, onClick }) {
  return (
    <button className="category-card" onClick={onClick}>
      <span className="category-emoji">
        {category.emoji || "🍽"}
      </span>

      <div className="category-info">
        <span className="category-name">
          {category.name}
        </span>

        <span className="category-count">
          {category.products.length} productos
        </span>
      </div>

      <span className="category-arrow">
        →
      </span>
    </button>
  )
}

export default CategoryCard