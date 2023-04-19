import { Request, Response, Router } from "express"
import { authMiddleware } from "../middleware/auth"
import { prisma } from ".."

const router = Router()

router.get("/:pageId", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const pageId = req.params.pageId
    try {
        const page = await prisma.page.findFirstOrThrow({
            where: {
                id: pageId,
                workspace: {
                    users: {
                        some: {
                            userId: userId
                        }
                    }
                }
            },
        })
        res.json(page)
    } catch (error) {
        res.status(404).json({ message: "Page not found or You don't have permission to access this page." })
    }
})

export default router
