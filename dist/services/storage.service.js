"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const sequelize_1 = require("sequelize");
const measurement_model_1 = require("../models/measurement.model");
class StorageService {
    constructor() {
        this._sequelize = new sequelize_1.Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false
        });
        measurement_model_1.Measurement.initialize(this._sequelize);
        this._sequelize.sync({ alter: true }).catch(err => console.log(err));
    }
    createMeasurement(measurement) {
        measurement_model_1.Measurement.create(measurement).catch(err => console.log(err));
    }
    createMeasurementFromValues(timestamp, blinkDuration) {
        measurement_model_1.Measurement.create({ timestamp, blinkDuration }).catch(err => console.log(err));
    }
    getAllUntransmitted() {
        return measurement_model_1.Measurement.findAll({ where: { transmitted: false }, order: [['timestamp', 'ASC']] })
            .then(ms => {
            ms.forEach(m => {
                m.transmitted = true;
                m.save();
            });
            return ms;
        });
    }
    transmissionFailed(measurements) {
        measurements.forEach(m => {
            m.transmitted = false;
            m.save();
        });
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map