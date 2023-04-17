import { Request, Response, Router } from "express"
import { PrismaClient } from "@prisma/client"
import { exclude } from "../libs/database"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const prisma: PrismaClient = new PrismaClient()

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            username: true
        },
        where: {
            id: res.locals.token.userId
        },
    })
    // const userWihoutPassword = exclude(user, ["password"])
    res.json(user)
})

export default router
