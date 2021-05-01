"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = void 0;
const sequelize_1 = require("sequelize");
class Measurement extends sequelize_1.Model {
    static initialize(sequelize) {
        Measurement.init({
            timestamp: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true },
            blinkDuration: { type: sequelize_1.DataTypes.INTEGER },
            transmitted: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false }
        }, { sequelize, timestamps: false });
    }
}
exports.Measurement = Measurement;
//# sourceMappingURL=measurement.model.js.map