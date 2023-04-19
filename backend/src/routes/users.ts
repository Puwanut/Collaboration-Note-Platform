import { Request, Response, Router } from "express"
import { authMiddleware } from "../middleware/auth"
import { prisma } from ".."

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
})

export default router
