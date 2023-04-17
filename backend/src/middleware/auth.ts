import { NextFunction, Request, Response } from 'express'

import { Cookies } from '../types/user.type'

import { verifyAccessToken } from '../libs/token-utils'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = verifyAccessToken(req.cookies[Cookies.AccessToken])

  if (!token) {
    res.status(401)
    return next(new Error('Unauthorized'))
  }

  res.locals.token = token

  next()
}
// export const jwtValidate = (req, res, next) => {
//     try {
//       const { token } = req.cookies

//       if (!token) return res.sendStatus(401)

//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) throw new Error(err)
//       })
//       next()
//     } catch (error) {
//       return res.sendStatus(403)
//     }
// }

// export const jwtRefreshTokenValidate = (req, res, next) => {
//   try {
//     const { token } = req.cookies
//     if (!token) return res.sendStatus(401)

//     jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//       if (err) throw new Error(err)

//       req.user = decoded
//       req.user.token = token
//       delete req.user.exp
//       delete req.user.iat
//     })
//     next()
//   } catch (error) {
//     return res.sendStatus(403)
//   }
// }
