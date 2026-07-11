import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { authRouter } from './routes/auth.js'

const PORT = process.env.PORT || 4000

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})
