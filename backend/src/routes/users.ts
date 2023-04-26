import { Request, Response, Router } from "express"
import { authMiddleware } from "../middleware/auth"
import { prisma } from ".."

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response) => {
    res.json({ message: "Not implemented yet" })
})

export default router
