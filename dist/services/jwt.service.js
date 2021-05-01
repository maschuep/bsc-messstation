"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTService {
    static tokenForMeasurements() {
        const secret = process.env.JWT_STATION_SECRET;
        const participant = process.env.PARTICIPANT;
        return jsonwebtoken_1.default.sign({ participant }, secret, { expiresIn: '1h' });
    }
}
exports.JWTService = JWTService;
//# sourceMappingURL=jwt.service.js.map