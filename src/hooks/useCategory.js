import { useEffect, useState } from "react"
import { getCategory } from "../services/api"

export function useCategory(slug, categoryId) {
  const [business, setBusiness] = useState(null)
  const [category, setCategory] = useState(null)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    getCategory(slug, categoryId)
      .then((res) => {
        setBusiness(res.data.business)
        setCategory(res.data.category)
        setChildren(res.data.category.children || [])
      })
      .catch(() => {
        setBusiness(null)
        setCategory(null)
        setChildren([])
      })
      .finally(() => {
        setLoading(false)
      })

  }, [slug, categoryId])

  return {
    business,
    category,
    children,
    loading,
  }
}