import { useEffect, useState } from "react"
import { getMenu } from "../services/api"

export function useCategory(slug, categoryId) {
  const [business, setBusiness] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    getMenu(slug)
      .then((res) => {
        setBusiness(res.data.business)

        const found = res.data.categories.find(
          (cat) => cat.id === Number(categoryId)
        )

        setCategory(found || null)
      })
      .catch(() => {
        setBusiness(null)
        setCategory(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug, categoryId])

  return {
    business,
    category,
    loading,
  }
}