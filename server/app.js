import express from 'express'
import cors from 'cors'
import "dotenv/config"
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebHooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'
import morgan from 'morgan'



const app = express()

await connectDB()
await connectCloudinary()

app.post("/stripe", express.raw({type: 'application/json'}), stripeWebHooks)


app.use(express.json())
app.use(cors())

// to make use of req.auth() which is added from the clerk middleware
app.use(clerkMiddleware())
app.use(morgan("dev"))

app.get("/", (req, res) => res.send("API Working"))
app.post("/clerk", clerkWebhooks)

app.use("/api/educator", educatorRouter)
app.use("/api/course", courseRouter)
app.use("/api/user", userRouter)


export default app