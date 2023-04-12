import express, { Application } from 'express'
import cors from 'cors'
import userRouter from './routes/users'
import authRouter from './routes/auth'


const app: Application = express()
const port = parseInt(process.env.PORT as string) || 8000

app.use(cors())
app.use(express.json())


app.use("/users", userRouter)
app.use("/auth", authRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
