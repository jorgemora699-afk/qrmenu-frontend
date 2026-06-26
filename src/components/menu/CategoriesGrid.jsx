import CategoryCard from "./CategoryCard"

function CategoriesGrid({ categories, onCategoryClick }) {
  return (
    <div className="menu-body">
      <p className="menu-subtitle">¿Qué deseas ver?</p>

      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoriesGrid