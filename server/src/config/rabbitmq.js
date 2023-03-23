const { default: amqp } = require("amqp-connection-manager")

const QUEUE = "SUBMISSIONS_QUEUE"

const connection = amqp.connect(['amqp://rabbitmq:5672'])

connection.on('connect', ()=>{
    console.log("Connected to RabbitMQ")
})

connection.on('disconnect', (err)=>{
    console.log("Disconnected from RabbitMQ")
})

const channelWrapper = connection.createChannel({
    json: true,
    setup: (channel) => {
        return Promise.all([
            channel.assertQueue(QUEUE,{durable: true}),
        ])
    }
})

export const publishToQueue = async (data) => {
    try {
        console.log("ENTERED")
        await channelWrapper.sendToQueue(QUEUE, data)
        console.log("MESSAGE SENT")
    } catch (err) {
        console.log("ERROR SENDING MESSAGE", err)
        channelWrapper.close()
        connection.close()
    }
}