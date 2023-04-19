import { Request, Response, Router } from "express";
import { prisma } from ".."
import { Prisma } from "@prisma/client";


const router = Router()

router.get("/", async (_req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const workspaces = await prisma.workspace.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    pages: true,
                    users: true
                }
            }
        },
        where: {
            users: {
                some: {
                    userId: userId
                }
            }
        }
    })
    res.json(workspaces)

})

router.get("/:workspaceId", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const workspaceId = req.params.workspaceId
    try {
        const workspace = await prisma.workspace.findFirstOrThrow({
            where: {
                id: workspaceId,
                users: {
                    some: {
                        userId: userId
                    }
                },
            },
            include: {
                pages: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                users: true
            }
        })
        res.json(workspace)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.name === "NotFoundError") {
                res.status(404).json({ message: "Workspace not found or You don't have permission to access this workspace." })
            }
        }
        res.status(400).json({ message: "Unkonwn error" })
    }
})

export default router
