"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNotificationService = void 0;
const http_1 = __importDefault(require("http"));
const jwt_service_1 = require("./jwt.service");
/**
 * notifies the backend in a certain time intervall about the measurements
 */
class HttpNotificationService {
    notifyDetailed(storage) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data = JSON.stringify(all);
                HttpNotificationService._sendData(all, data, storage);
            }
        });
    }
    notifyAggregated(storage) {
        storage.getAllUntransmitted().then(all => {
            const intervall = 1800;
            if (!all || all.length <= 0)
                return;
            const startValue = all[0];
            const aggregated = all.reduce((acc, curr) => {
                const latestMeasurement = acc.pop();
                if (latestMeasurement.timestamp + intervall > curr.timestamp) {
                    latestMeasurement.wh++;
                    acc.push(latestMeasurement);
                }
                else {
                    acc.push(latestMeasurement);
                    acc.push({ timestamp: latestMeasurement.timestamp + intervall, wh: 1 });
                }
                return acc;
            }, [{ timestamp: startValue.timestamp, wh: 0 }]);
            console.log(aggregated);
            HttpNotificationService._sendData(all, JSON.stringify(aggregated), storage);
        });
    }
    static _sendData(all, data, storage) {
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
}
exports.HttpNotificationService = HttpNotificationService;
//# sourceMappingURL=http-notifiaction.service.js.map