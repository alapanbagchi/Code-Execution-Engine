import express from 'express'
import cors from 'cors'
import submissionRouter from './routes/submissions.route'
import { redisClient } from './config/redis'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))


app.use('/api/submission', submissionRouter)

app.get('/', (req, res) => {
    res.send('REMOTE CODE EXECUTION ENGINE')
    }
)
const PORT = process.env.PORT || 8000

const init = async () => {
    try {
        await redisClient.connect()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (err) {
        console.log(err)
    }
}

init()
