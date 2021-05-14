"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const http_1 = __importDefault(require("http"));
const jwt_service_1 = require("./jwt.service");
/**
 * notifies the backend in a certain time intervall about the measurements
 */
class NotificationService {
    notify(storage) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data = JSON.stringify(all);
                const options = {
                    hostname: process.env.BACKEND_URL,
                    port: process.env.BACKEND_PORT,
                    path: `/measurement/${process.env.PARTICIPANT}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length,
                        'Authorization': `Bearer ${jwt_service_1.JWTService.tokenForMeasurements()}`
                    }
                };
                const req = http_1.default.request(options, res => {
                    res.on("error", (err) => {
                        storage.transmissionFailed(all);
                        console.error(new Date().toISOString(), err);
                    });
                });
                req.on("error", (err) => {
                    storage.transmissionFailed(all);
                    console.error(new Date().toISOString(), err);
                });
                req.write(data);
                req.on('finish', () => console.log(new Date().toISOString(), `sent: ${all.length} wh, size: ${data.length * 16 / 8} B`));
                req.end();
            }
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notifiaction.service.js.map