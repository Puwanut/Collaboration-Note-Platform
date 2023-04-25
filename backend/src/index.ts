import express, { Application } from 'express'
import cors from 'cors'
import userRouter from './routes/users'
import authRouter from './routes/auth'
import workspaceRouter from './routes/workspaces'
import pageRouter from './routes/pages'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from './middleware/auth'

const app: Application = express()
const port = parseInt(process.env.PORT as string) || 8000
export const prisma = new PrismaClient()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())


app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/workspaces", authMiddleware, workspaceRouter)
app.use("/pages", authMiddleware, pageRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
