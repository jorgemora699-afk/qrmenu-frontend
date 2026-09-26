import { motion } from "framer-motion"
import CategoryCard from "./CategoryCard"

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function CategoriesGrid({ categories, onCategoryClick }) {
  return (
    <div className="menu-body">
      <p className="menu-subtitle">¿Qué deseas ver?</p>

      <motion.div
        className="categories-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, index) => (
          <motion.div key={category.id} variants={itemVariants}>
            <CategoryCard
              category={category}
              index={index}
              onClick={() => onCategoryClick(category)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default CategoriesGrid