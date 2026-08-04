import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { authRouter } from './routes/auth.js'
import { tweetRouter } from './routes/tweet.js'
import { searchRouter } from './routes/search.js'

const PORT = process.env.PORT || 4000

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/tweet", tweetRouter)
app.use("/api/search", searchRouter)

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})
