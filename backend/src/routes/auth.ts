import { Response, Router } from "express"
import { TypedRequestBody, TypedRequestQuery } from "../types/request.type"
import { User } from "../types/user.type"
import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { initialPage } from "../constants/initialPage"

const router = Router()
const prisma: PrismaClient = new PrismaClient()

// if post /auth/login, check if user exists in db
router.post("/register", async (req: TypedRequestBody<User>, res: Response) => {
    const { username, password, email } = req.body
    if (username && password && email) {
        try {
            const latestUser = await prisma.user.findFirst({
                 orderBy: { id: "desc" }
            })
            const latestId = latestUser ? latestUser.id + 1 : 1
            const user = await prisma.user.create({
                data: {
                    id: latestId,
                    username: username,
                    email: email,
                    password: await bcrypt.hash(password, 10) // Hash password with bcrypt
                }
            })
            if (user) {
                // create initial workspace and initial page in same workspace
                // with nested create, Page will be created with workspaceId automatically
                try {
                    await prisma.workspace.create({
                        data: {
                            name: `${username}'s Workspace`,
                            pages: {
                                create: [initialPage]
                            },
                            users: {
                                create: [
                                    {
                                        userId: user.id,
                                        role: "owner"
                                    }
                                ]
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
                res.status(200).json({
                    status: "ok",
                    message: "Register Successfully"
                })
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") { // Unique constraint
                    res.status(400).json({
                        status: "error",
                        message: "This Email is already used."
                    })
                }
            }
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "Invalid request"
        })
    }
})

router.post("/login", async (req: TypedRequestBody<User>, res: Response) => {
    const { email, password } = req.body
    if (email && password) {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            const isMatchedPassword = await bcrypt.compare(password, user.password)
            if (isMatchedPassword) {
                res.status(200).json({
                    status: "ok",
                    message: "Login Successfully",
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                })
            } else {
                res.status(400).json({
                    status: "error",
                    message: "Username or Password are incorrect" // Password is incorrect
                })
            }
        } else {
            res.status(400).json({
                status: "error",
                message: "Username or Password are incorrect" // User is not found
            })
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "Invalid request"
        })
    }
})

export default router