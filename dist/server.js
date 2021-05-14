"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blink_service_1 = require("./services/blink.service");
const notifiaction_service_1 = require("./services/notifiaction.service");
const storage_service_1 = require("./services/storage.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const intervall = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10);
const notificationIntervall = Number.parseInt(process.env.NOTIFICATION_INTERVALL, 10);
const storage = new storage_service_1.StorageService();
const notifier = new notifiaction_service_1.NotificationService();
const blink = new blink_service_1.BlinkService();
setInterval(notifier.notify, notificationIntervall, storage);
if (process.env.ENVIRONMENT === 'dev') {
    blink.emulate(intervall, storage);
}
else if (process.env.ENVIRONMENT === 'rpi') {
    blink.measure(storage);
}
else {
    throw new Error('environment must be "dev" or "rpi"');
}
console.log('station started ...');
//# sourceMappingURL=server.js.map