"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductForm from "@/components/productForm"
import { getProductById, Product } from "@/services/productService"

function ProductFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("id")

  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState(!!productId)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""

  useEffect(() => {
    if (productId && token) {
      const fetchProductData = async () => {
        try {
          const productData = await getProductById(productId, token)
          setProduct(productData)
        } catch (error) {
          console.error("Error fetching product:", error)
          alert("Error al cargar el producto")
        } finally {
          setLoading(false)
        }
      }
      fetchProductData()
    }
  }, [productId, token])

  const handleSuccess = () => {
    alert(product ? "Producto actualizado exitosamente" : "Producto creado exitosamente")
    router.push("/products")
  }

  const handleClose = () => {
    router.push("/products")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
          <div className="text-center font-medium text-gray-600">Cargando producto...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {productId ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        <ProductForm
          product={product} 
          token={token}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      </div>
    </div>
  )
}

export default function FormularioProductoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
            <div className="text-center font-medium text-gray-600">Cargando...</div>
          </div>
        </div>
      }
    >
      <ProductFormContent />
    </Suspense>
  )
}
