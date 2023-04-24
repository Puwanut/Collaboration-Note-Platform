import { Request, Response, Router } from "express"
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

router.put("/:pageId", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const pageId = req.params.pageId
    const { title, blocks } = req.body
    try {
        const page = await prisma.page.updateMany({
            data: {
                title: title,
                blocks: blocks
            },
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
        res.status(404).json({ message: "Page not found or You don't have permission to modify this page." })
    }
})

router.patch("/:pageId/title", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const pageId = req.params.pageId
    const { title } = req.body
    try {
        const page = await prisma.page.updateMany({
            data: {
                title: title
            },
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
    } catch (e) {
        res.status(404).json({ message: "Page not found or You don't have permission to modify this page." })
    }
})

router.patch("/:pageId/favorite", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const pageId = req.params.pageId
    const { isFavorite } = req.body
    try {
        const page = await prisma.page.updateMany({
            data: {
                isFavorite: isFavorite
            },
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
    } catch (e) {
        res.status(404).json({ message: "Page not found or You don't have permission to modify this page." })
    }
})


router.delete("/:pageId", async (req: Request, res: Response) => {
    const userId = res.locals.user.userId
    const pageId = req.params.pageId
    try {
        const page = await prisma.page.deleteMany({
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
    } catch (e) {
        res.status(404).json({ message: "Page not found or You don't have permission to delete this page." })
    }

})

export default router
