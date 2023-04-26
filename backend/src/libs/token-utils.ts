import jwt, { JwtPayload } from 'jsonwebtoken';

export function generateAccessToken(user: JwtPayload): string {
    if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('ACCESS_TOKEN_SECRET is not defined')
    return jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '1d' })
  }
