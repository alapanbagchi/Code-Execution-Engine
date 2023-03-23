"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToQueue = void 0;
const { default: amqp } = require("amqp-connection-manager");
const QUEUE = "SUBMISSIONS_QUEUE";
const connection = amqp.connect(["amqp://localhost:5672"]);
connection.on('connect', () => {
    console.log("Connected to RabbitMQ");
});
connection.on('disconnect', (err) => {
    console.log("Disconnected from RabbitMQ");
});
const channelWrapper = connection.createChannel({
    json: true,
    setup: (channel) => {
        return Promise.all([
            channel.assertQueue(QUEUE, { durable: true }),
        ]);
    }
});
const publishToQueue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ENTERED");
        yield channelWrapper.sendToQueue(QUEUE, data);
        console.log("MESSAGE SENT");
    }
    catch (err) {
        console.log("ERROR SENDING MESSAGE", err);
        channelWrapper.close();
        connection.close();
    }
});
exports.publishToQueue = publishToQueue;
