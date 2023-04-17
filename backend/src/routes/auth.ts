import { Response, Router } from "express"
import { TypedRequestBody, TypedRequestQuery } from "../types/request.type"
import { Cookies, User, UserLogin, UserRegister } from "../types/user.type"
import { Prisma, PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { buildTokens, clearTokens, refreshTokens, setTokens, verifyRefreshToken } from "../libs/token-utils"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const prisma: PrismaClient = new PrismaClient()

// if post /auth/login, check if user exists in db
router.post("/register", async (req: TypedRequestBody<UserRegister>, res: Response) => {
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
                // const { accessToken, refreshToken } = buildTokens(user)
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

router.post("/login", async (req: TypedRequestBody<UserLogin>, res: Response) => {
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
                const { accessToken, refreshToken } = buildTokens(user)
                setTokens(res, accessToken, refreshToken)
                res.status(200).json({
                    status: "ok",
                    message: "Login Successfully"
                })
                // res.redirect(`${process.env.CLIENT_URL}`)
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

router.post("/refresh", async (req, res) => {
    try {
        const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken])
        const user = await prisma.user.findUnique({
            where: {
                id: current.userId
            }
        })

        if (!user) throw 'User not found'
        const { accessToken, refreshToken } = refreshTokens(current, user.tokenVersion)
        setTokens(res, accessToken, refreshToken)

    } catch (err) {
        clearTokens(res)
    }
    res.end()
})

router.post("/logout", authMiddleware, async (req, res) => {
    clearTokens(res)
    res.end()
})



export default router
