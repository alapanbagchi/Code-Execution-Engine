import { redisClient } from './config/redis';
import fs from 'fs';
import { execute } from './utils/execute';
import './config/rabbitmq'
import rimraf from 'rimraf'

const languages = {
    c: 'c',
    cpp : 'cpp',
    java: 'java',
    python3: 'txt',
}

const init = async () => {
    await redisClient.connect()
}

const run = async (data: any, channel, message) => {
    try{
        redisClient.set(data.id.toString(), 'PROCESSING')
        const command = `python3 run.py ../temp/${data.id}/source.${languages[data.lang]} ${data.lang} ${data.timeout}`
        await fs.promises.writeFile(`/temp/${data.id}/output.txt`, "");
        const output = await execute(command)
        console.log(output)
        const output_data = await fs.promises.readFile(`/temp/${data.id}/output.txt`, "utf-8")
        console.log(output_data)
        const result = {
            output: output_data,
            stderr: output.stderr,
            status: output.stdout,
            id: data.id
        }
        // Delete the temp folder using rimraf
        const isDeleted = await rimraf(`/temp/${data.id}`)
        if(isDeleted) {
            redisClient.set(data.id.toString(), JSON.stringify(result))
            channel.ack(message)
        }
    } catch(err) {
        console.log(err)
    }
}


export const createFiles = async (data: any, channel, message) => {
    try {
        await fs.promises.mkdir(`/temp/${data.id}`);
        await fs.promises.writeFile(`/temp/${data.id}/input.txt`, data.input);
        await fs.promises.writeFile(`/temp/${data.id}/source.${languages[data.lang]}`, data.src);
        await run(data, channel, message);
    } catch (error) {
        console.log(error)
    }
};

init()