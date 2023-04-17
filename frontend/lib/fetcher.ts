import { RequestInit } from 'next/dist/server/web/spec-extension/request'

export type QueryResponse<T> = [error: string | null, data: T | null]

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
}

export const refreshTokens = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    ...fetchOptions
  })
}

const handleRequest = async (request: () => Promise<Response>): Promise<Response> => {
  try {
    return await request()
  } catch (error) {
    if (error?.response?.status === 401) { // unauthorized
      try {
        await refreshTokens()
        return await request()
      } catch (innerError) {
        throw innerError.response.data
      }
    }
    throw error.response.data
  }
}

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => fetch(url, {method: 'GET', ...fetchOptions})
    const data = await handleRequest(request) as T
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

export const poster = async <T>(url: string, payload?: unknown): Promise<QueryResponse<T>> => {
  try {
    const request = () => fetch(url, {method: 'POST', body: JSON.stringify(payload), ...fetchOptions})
    const data = await handleRequest(request) as T
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
