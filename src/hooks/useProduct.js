import { useEffect, useState } from "react"
import { getCategory } from "../services/api"

export function useProduct(slug, categoryId, productId) {
  const [business, setBusiness] = useState(null)
  const [category, setCategory] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    getCategory(slug, categoryId)
      .then((res) => {
        setBusiness(res.data.business)
        setCategory(res.data.category)

        const foundProduct = res.data.category?.products?.find(
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