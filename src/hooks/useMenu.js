import { useEffect, useState } from "react"
import { getMenu } from "../services/api"

export function useMenu(slug) {
  const [business, setBusiness] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    getMenu(slug)
      .then((res) => {
        setBusiness(res.data.business)
        setCategories(res.data.categories)
      })
      .catch(() => {
        setBusiness(null)
        setCategories([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  return {
    business,
    categories,
    loading,
  }
}