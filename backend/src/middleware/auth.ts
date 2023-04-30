
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers['authorization']) return res.sendStatus(401)

        const token = req.headers['authorization'].replace('Bearer ', '')

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
          if (err) throw new Error()
          res.locals.user = {
            userId: (decoded as any).userId
          }
          next()
        })
    } catch (e) {
        return res.status(403).send("Invalid Token")
    }
  }
