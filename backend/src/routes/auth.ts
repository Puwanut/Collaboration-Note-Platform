import { Response, Router } from "express"
import { TypedRequestBody, TypedRequestQuery } from "../types/request.type"
import { User } from "../types/user.type"
import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const router = Router()
const prisma: PrismaClient = new PrismaClient()

// if post /auth/login, check if user exists in db
router.post("/register", async (req: TypedRequestBody<User>, res: Response) => {
    const { username, password } = req.body
    if (username && password) {
        try {
            const latestUser = await prisma.user.findFirst({
                 orderBy: { id: "desc" }
            })
            const latestId = latestUser ? latestUser.id + 1 : 1
            const user = await prisma.user.create({
                data: {
                    id: latestId,
                    username: username,
                    password: await bcrypt.hash(password, 10) // Hash password with bcrypt
                }
            })
            if (user) {
                res.status(200).json({
                    message: "Register Successfully"
                })
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") { // Unique constraint
                    res.status(400).json({
                        error: "This user is already exists."
                    })
                }
            }
        }
    } else {
        res.status(400).json({
            error: "Username or Password are incorrect"
        })
    }
})

router.post("/login", async (req: TypedRequestBody<User>, res: Response) => {
    const { username, password } = req.body
    if (username && password) {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (user) {
            const isMatchedPassword = await bcrypt.compare(password, user.password)
            if (isMatchedPassword) {
                res.status(200).json({
                    message: "Login Successfully"
                })
            } else {
                res.status(400).json({
                    error: "Username or Password are incorrect"
                })
            }
        } else {
            res.status(400).json({
                error: "Username or Password are incorrect"
            })
        }
    }
})

export default router
