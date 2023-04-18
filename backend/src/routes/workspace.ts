import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { prisma } from ".."

const router = Router()

router.get("/", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const workspaces = await prisma.workspace.findMany({
        where: {
            users: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            pages: true,
            users: true
        }
    })
    res.json(workspaces)

})

export default router
