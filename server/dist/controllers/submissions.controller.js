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
const crypto_1 = require("crypto");
const rabbitmq_1 = require("../config/rabbitmq");
const redis_1 = require("../config/redis");
const submissionController = {
    submit: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = {
                id: (0, crypto_1.randomBytes)(4).toString('hex'),
                src: req.body.src,
                lang: req.body.lang,
                input: req.body.stdin,
                timeout: req.body.timeout,
            };
            yield (0, rabbitmq_1.publishToQueue)(data);
            res.status(200).send({
                message: "SUCCESS",
                url: `http://localhost:8000/results/${data.id}`
            });
        }
        catch (err) {
            res.status(500).send(err);
        }
    }),
    getResult: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let key = req.params.id;
            let status = yield redis_1.redisClient.get(key);
            switch (status) {
                case null:
                    res.status(200).send({ status: "QUEUED" });
                    break;
                case "RUNNING":
                    res.status(200).send({ status: "RUNNING" });
                    break;
                case "COMPLETED": {
                    status = JSON.parse(status);
                    res.status(200).send({
                        status: "COMPLETED",
                        result: status
                    });
                }
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    })
};
exports.default = submissionController;
