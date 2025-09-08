"use client"

import { useState, useEffect } from "react"
import api from "./api" // tu instancia de axios

// Interfaces
export interface Product {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  estado: boolean
  fechaCreacion: string
}

export interface ProductInput {
  nombre: string
  descripcion?: string
  precio: number
  estado: boolean
}

export interface Filters {
  nombre?: string
  estado?: string
  precioMin?: string
  precioMax?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7224/api"

// CRUD

// Crear producto
export async function createProduct(data: ProductInput, token: string) {
  const res = await api.post("/productos", data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data as Product
}

// Editar producto
export async function updateProduct(id: string, data: ProductInput, token: string) {
  const res = await api.put(`/productos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data as Product
}

// Eliminar producto
export async function deleteProduct(id: string, token: string) {
  const res = await api.delete(`/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// Obtener un producto por ID
export async function getProductById(id: string, token: string): Promise<Product> {
  const res = await api.get(`/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data as Product
}

//  LISTAR PRODUCTOS CON FILTROS Y PAGINACIÓN
export const useProducts = (
  filters: { nombre: string; estado: string; precioMin: string; precioMax: string },
  page: number,
  pageSize: number,
  token: string,
) => {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      let query = `?page=${page}&pageSize=${pageSize}`
      if (filters.nombre && filters.nombre.trim() !== "") query += `&nombre=${encodeURIComponent(filters.nombre)}`
      if (filters.estado && filters.estado !== "all") query += `&estado=${filters.estado}`
      if (filters.precioMin && filters.precioMin.trim() !== "") query += `&precioMin=${filters.precioMin}`
      if (filters.precioMax && filters.precioMax.trim() !== "") query += `&precioMax=${filters.precioMax}`

      try {
        const res = await fetch(`${API_BASE_URL}/productos/filter${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        setProducts(data.productos || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("Error al cargar productos:", error)
        if (error instanceof Error) {
          if (error.message.includes("fetch")) {
            setError("No se puede conectar al servidor. Verifica que el backend esté ejecutándose.")
          } else {
            setError(error.message)
          }
        } else {
          setError("Error desconocido al cargar productos")
        }
        setProducts([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProducts()
    } else {
      setLoading(false)
      setError("Token de autenticación no disponible")
    }
  }, [filters, page, pageSize, token])

  return { products, total, loading, error }
}
