import CategoryCard from "./CategoryCard"

function CategoriesGrid({ categories, onCategoryClick }) {
  return (
    <div className="menu-body">
      <p className="menu-subtitle">¿Qué deseas ver?</p>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            onClick={() => onCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoriesGrid