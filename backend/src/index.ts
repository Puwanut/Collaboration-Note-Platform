import express, { Application } from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import workspaceRouter from './routes/workspaces'
import pageRouter from './routes/pages'
import imageRouter from './routes/images'
import { authMiddleware } from './middleware/auth'

const app: Application = express()
const port = parseInt(process.env.PORT as string) || 8000

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())

app.get("/health", (_req, res) => {
    res.json({ message: "OK" })
})

app.use("/auth", authRouter)
app.use("/workspaces", authMiddleware, workspaceRouter)
app.use("/pages", authMiddleware, pageRouter)
app.use("/images", authMiddleware, imageRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
