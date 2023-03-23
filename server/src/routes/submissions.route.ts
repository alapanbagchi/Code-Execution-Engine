import express from "express"
import submissions from '../controllers/submissions.controller'

const router = express.Router()

router.post('/post', async(req, res) => submissions.submit(req,res))
router.get('/results/:id', async(req, res) => submissions.getResult(req,res))

export default router