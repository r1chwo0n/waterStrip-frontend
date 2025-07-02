// src/lib/api.ts
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3003'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`API Error: ${errorMessage}`)
  }

  return response.json()
}