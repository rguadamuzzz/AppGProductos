"use client"

import { useState } from "react"
import { useProducts, deleteProduct } from "@/services/productService"
import { useRouter } from "next/navigation"
import { Search, Plus, Download, Edit, Trash2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

interface Product {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  estado: boolean
  fechaCreacion: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7224/api"

const ProductManagement = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""

  const [filters, setFilters] = useState({
    nombre: "",
    estado: "all",
    precioMin: "",
    precioMax: "",
  })

  const [page, setPage] = useState(1)
  const pageSize = 10

  const { products, total, loading, error } = useProducts(filters, page, pageSize, token)
  const router = useRouter()

  const totalPages = Math.ceil(total / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const reload = () => setPage(1)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      nombre: "",
      estado: "all",
      precioMin: "",
      precioMax: "",
    })
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desea eliminar este producto?")) return
    try {
      await deleteProduct(id, token)
      alert("Producto eliminado")
      reload()
    } catch (error) {
      console.error(error)
      alert("Error al eliminar producto")
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""

      const res = await fetch(`${API_BASE_URL}/productos/reporte-pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Error al generar PDF: ${res.status} ${res.statusText}`)
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "reporte_productos.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar PDF:", error)
      alert("No se pudo generar el PDF. Verifica la conexión con el servidor.")
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error de Conexión</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="text-center text-gray-600">Cargando productos...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600">Administra tu inventario de productos</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </button>
            <button
              onClick={() => router.push("/form")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Búsqueda
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre del producto</label>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filters.nombre}
                  onChange={(e) => handleFilterChange("nombre", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange("estado", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Precio mínimo</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.precioMin}
                  onChange={(e) => handleFilterChange("precioMin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Precio máximo</label>
                <input
                  type="number"
                  placeholder="999.99"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange("precioMax", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Productos</h2>
              <div className="text-sm text-gray-500">
                Mostrando {startItem}-{endItem} de {total} productos
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha Creación</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: Product, index: number) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{product.nombre}</td>
                      <td className="py-3 px-4 text-gray-600">{product.descripcion || "Sin descripción"}</td>
                      <td className="py-3 px-4 font-mono text-gray-900">${product.precio.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.estado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(product.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/form?id=${product.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 rounded text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron productos que coincidan con los filtros
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-8 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                          pageNum === page
                            ? "bg-cyan-600 text-white"
                            : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductManagement
