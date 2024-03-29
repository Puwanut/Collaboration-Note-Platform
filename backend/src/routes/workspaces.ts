import { Request, Response, Router } from "express";
import { prisma } from "../libs/prisma";
import { Page, Prisma } from "@prisma/client";
import { TypedRequestBody } from "../types/request.type";

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
                        title: true,
                        isFavorite: true,
                        icon: true,
                    },
                    orderBy: {
                        createdAt: "asc"
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

router.post("/:workspaceId/pages", async (req: TypedRequestBody<Page>, res: Response) => {
    const userId = res.locals.user.userId
    const { workspaceId } = req.params
    const { id, title, blocks, icon, cover } = req.body
    try {
        const page = await prisma.page.create({
            data: {
                id: id,
                title: title,
                icon: icon,
                cover: cover,
                blocks: blocks,
                workspace: {
                    connect: {
                        id: workspaceId
                    }
                }
            },
        })
        res.json(page)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                res.status(400).json({ message: "Page already exists in this workspace." })
            }
        } else {
            console.log(e)
            res.status(404).json({ message: "Workspace not found or You don't have permission to create a page in this workspace." })
        }
    }
})

router.delete("/:workspaceId/pages/:pageId", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const { workspaceId, pageId } = req.params
    try {
        const page = await prisma.page.deleteMany({
            where: {
                id: pageId,
                workspace: {
                    id: workspaceId,
                    users: {
                        some: {
                            userId: userId
                        }
                    }
                }
            }
        })
        res.json(page)
    } catch (e) {
        res.status(404).json({ message: "Page not found or You don't have permission to delete this page." })
    }
})

export default router
