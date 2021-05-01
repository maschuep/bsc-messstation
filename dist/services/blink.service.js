"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlinkService = void 0;
const onoff_1 = require("onoff");
/**
 * registers every blink and saves it into storage
 */
class BlinkService {
    measure(storage) {
        const photo = new onoff_1.Gpio(17, 'in', 'both', { debounceTimeout: 30 });
        let start = -1;
        let stop = -1;
        let ledOn = false;
        const data = { timestamp: -1, blinkDuration: -1 };
        photo.watch((err, value) => {
            if (err)
                throw err;
            if (value === 1 && !ledOn) {
                start = new Date().valueOf();
                data.timestamp = start;
                ledOn = true;
            }
            else if (value === 0 && ledOn) {
                let since = 0;
                if (stop !== -1)
                    since = start - stop;
                stop = new Date().valueOf();
                data.blinkDuration = stop - start;
                // storage.createMeasurement(data)
                console.log(data, since);
                ledOn = false;
            }
        });
        process.on('SIGINT', () => {
            photo.unexport();
        });
    }
    emulate(intervall, storage) {
        setInterval(this._generateMeasurements, intervall, storage);
    }
    _generateMeasurements(storage) {
        storage.createMeasurementFromValues(new Date().valueOf(), Math.floor(Math.random() * 50));
    }
}
exports.BlinkService = BlinkService;
//# sourceMappingURL=blink.service.js.map