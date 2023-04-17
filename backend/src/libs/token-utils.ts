import jwt from "jsonwebtoken"
import { AccessToken, AccessTokenPayload, Cookies, RefreshToken, RefreshTokenPayload, User } from "../types/user.type"
import { CookieOptions, Response } from "express"

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string

enum TokenExpiration {
  Access = 1 * 60, // 5 minutes
  Refresh = 7 * 24 * 60 * 60, // 7 days
  RefreshIfLessThan = 4 * 24 * 60 * 60 // 4 days
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessTokenSecret, {expiresIn: TokenExpiration.Access, algorithm: "HS256"})
}

function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, refreshTokenSecret, {expiresIn: TokenExpiration.Refresh, algorithm: "HS256"})
}

export function buildTokens(user: User) {
  const accessPayload: AccessTokenPayload = { userId: user.id}
  const refreshPayload: RefreshTokenPayload = { userId: user.id, version: user.tokenVersion }

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return { accessToken, refreshToken }
}

const isProduction = process.env.NODE_ENV === "production"

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: process.env.BASE_DOMAIN,
  path: "/",
}

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 1000 * TokenExpiration.Refresh, // 7 days
}

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 1000 * TokenExpiration.Access, // 5 minutes
}

export const setTokens = (res: Response, access: string, refresh?: string) => {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions)
  if (refresh) {
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions)
  }
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret) as RefreshToken
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken
  } catch (err) {}
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw 'Token revoked'

  const accessPayload: AccessTokenPayload = {userId: current.userId}
  let refreshPayload: RefreshTokenPayload | undefined

  const expiration = new Date(current.exp * 1000)
  const now = new Date()
  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000

  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = {userId: current.userId, version: tokenVersion}
  }

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return {accessToken, refreshToken}
}

export function clearTokens(res: Response) {
  // res.cookie(Cookies.AccessToken, '', {...defaultCookieOptions, maxAge: 0})
  // res.cookie(Cookies.RefreshToken, '', {...defaultCookieOptions, maxAge: 0})
  res.clearCookie(Cookies.AccessToken)
  res.clearCookie(Cookies.RefreshToken)
}
