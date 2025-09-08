"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { type Product, type ProductInput, createProduct, updateProduct } from "@/services/productService"
import { Save, X, Package } from "lucide-react"

interface ProductFormProps {
  product?: Product
  token: string
  onSuccess: () => void
  onClose: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, token, onSuccess, onClose }) => {
  const [nombre, setNombre] = useState(product?.nombre || "")
  const [descripcion, setDescripcion] = useState(product?.descripcion || "")
  const [precio, setPrecio] = useState(product?.precio || 0)
  const [estado, setEstado] = useState(product?.estado ?? true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setNombre(product.nombre)
      setDescripcion(product.descripcion || "")
      setPrecio(product.precio)
      setEstado(product.estado)
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data: ProductInput = { nombre, descripcion, precio, estado }

    try {
      if (product?.id) {
        await updateProduct(product.id, data, token)
      } else {
        await createProduct(data, token)
      }
      onSuccess()
    } catch (error) {
      console.error("Error guardando producto:", error)
      alert("Ocurrió un error al guardar el producto.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-cyan-600" />
            <h1 className="text-3xl font-bold text-gray-900">{product ? "Editar Producto" : "Nuevo Producto"}</h1>
          </div>
          <p className="text-gray-600">
            {product ? "Modifica la información del producto" : "Completa los datos para crear un nuevo producto"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Información del Producto</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre del producto *
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa el nombre del producto"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe las características del producto"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                  Precio *
                </label>
                  <input
                  id="precio"
                  type="number"
                  value={precio === 0 ? "" : precio}
                  onChange={(e) => {
                  const value = e.target.value;
                  setPrecio(value === "" ? 0 : Number(value));
                  }}
                  placeholder="0.00"
                  required
                  min={0}
                  step={0.01}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  value={estado ? "activo" : "inactivo"}
                  onChange={(e) => setEstado(e.target.value === "activo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductForm
