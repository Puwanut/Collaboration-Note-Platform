import express, { Application } from 'express'
import cors from 'cors'
import userRouter from './routes/users'
import authRouter from './routes/auth'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middleware/auth'

dotenv.config()

const app: Application = express()
const port = parseInt(process.env.PORT as string) || 8000

app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())



app.use("/users", authMiddleware, userRouter)
app.use("/auth", authRouter)
app.get("/", (req, res) => {
    res.send("Healthy")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
