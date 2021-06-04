"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BscBackendService = void 0;
const http_1 = __importDefault(require("http"));
const jwt_service_1 = require("./jwt.service");
class BscBackendService {
    static sendData(data) {
        return new Promise((resolve, reject) => {
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
                    reject(err);
                });
            });
            req.on("error", (err) => {
                reject(err);
            });
            req.write(data);
            req.on('finish', (a) => {
                resolve(a);
            });
            req.end();
        });
    }
}
exports.BscBackendService = BscBackendService;
//# sourceMappingURL=bsc-backend.service.js.map