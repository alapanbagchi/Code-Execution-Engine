import { exec } from "child_process"

export const execute = (command):any => {
    return new Promise((resolve, reject)=>{
        exec(command, (err, stdout, stderr) => {
            if(err) return reject(err)
            else {
                let status = {
                    stdout: stdout,
                    stderr: stderr
                }
                return resolve(status)
            }
        })
    })
}