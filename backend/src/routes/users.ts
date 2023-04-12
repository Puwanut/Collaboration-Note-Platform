import { Request, Response, Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
})

export default router
