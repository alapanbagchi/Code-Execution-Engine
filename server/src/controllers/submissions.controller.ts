import { Request, Response, Router } from "express";
import { randomBytes } from 'crypto';
import { publishToQueue } from "../config/rabbitmq";
import { redisClient } from "../config/redis";

const submissionController = {
    submit: async (req: Request, res: Response) => {
        try {
            const data = {
                id: randomBytes(4).toString('hex'),
                src: req.body.src,
                lang: req.body.lang,
                input: req.body.stdin,
                timeout: req.body.timeout,
            }
            await publishToQueue(data)
            res.status(200).send({
                message: "SUCCESS",
                url: `http://localhost:8000/api/submission/results/${data.id}`
            })
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getResult: async (req: Request, res: Response) => {
        try {
            let key = req.params.id
            console.log(key)
            let status = await redisClient.get(key)
            console.log("STATUS: ", status)
            return res.status(200).send({
                status: status
            })
        } catch (err) {
            res.status(500).send(err)
        }
    }
}



export default submissionController