export type UserRegister = {
    username: string
    email: string
    password: string
}

export type UserLogin = {
    email: string
    password: string
}

export type User = {
    id: number
    username: string
    email: string
    tokenVersion: number
}

export interface AccessTokenPayload {
    userId: number
}

export interface RefreshTokenPayload {
    userId: number
    version: number
}

export interface AccessToken extends AccessTokenPayload {
    exp: number
}

export interface RefreshToken extends RefreshTokenPayload {
    exp: number
}


export enum Cookies {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token'
}
