// import axios, {AxiosResponse} from 'axios'
import {IncomingMessage, ServerResponse} from 'http'

// import {environment} from './environment'
// import {getError} from './errors'
import {QueryResponse} from './fetcher'

export const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    headers: {
      cookie: req.headers.cookie,
    },
  })
  const cookies = response.headers['set-cookie']

  req.headers.cookie = cookies
  res.setHeader('set-cookie', cookies)
}

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  request: () => Promise<Response>
) => {
  try {
    return await request().then((res) => res.json())
  } catch (error) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens(req, res)
        return await request().then((res) => res.json())
      } catch (innerError) {
        throw innerError.response.data
      }
    }

    throw error.response.data
  }
}

export const fetcherSSR = async <T>(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const request = () => fetch(url, { method: "GET", headers: {cookie: req.headers.cookie, 'Content-Type': 'application/json'} })
    const data = await handleRequest(req, res, request) as T
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
