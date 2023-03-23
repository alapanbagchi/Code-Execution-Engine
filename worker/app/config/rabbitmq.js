import * as amqp from 'amqp-connection-manager';
import { createFiles } from '../index'


const QUEUE = "SUBMISSIONS_QUEUE"

const connection = amqp.connect(['amqp://rabbitmq:5672']);

connection.on('connect', function () {
    console.log('Connected!');
});

connection.on('disconnect', function (err) {
    console.log('Disconnected.', err);
});

const onMessage = (data) => {
    let message = JSON.parse(data.content.toString());
    createFiles(message, channelWrapper, data);
}

const channelWrapper = connection.createChannel({
    setup: function (channel) {
        return Promise.all([
            channel.assertQueue(QUEUE, { durable: true }),
            channel.prefetch(1),
            channel.consume(QUEUE, onMessage)
        ]);
    }
});

channelWrapper.waitForConnect()
    .then(function () {
        console.log("Listening for messages");
    });