import { useEffect, useState } from "react"
import { getMenu } from "../services/api"

export function useProduct(slug, categoryId, productId) {
  const [business, setBusiness] = useState(null)
  const [category, setCategory] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    getMenu(slug)
      .then((res) => {
        setBusiness(res.data.business)

        const foundCategory = res.data.categories.find(
          (cat) => cat.id === Number(categoryId)
        )

        if (!foundCategory) {
          setCategory(null)
          setProduct(null)
          return
        }

        setCategory(foundCategory)

        const foundProduct = foundCategory.products.find(
          (p) => p.id === Number(productId)
        )

        setProduct(foundProduct || null)
      })
      .catch(() => {
        setBusiness(null)
        setCategory(null)
        setProduct(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug, categoryId, productId])

  return {
    business,
    category,
    product,
    loading,
  }
}