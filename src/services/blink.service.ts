import { StorageService } from "./storage.service";
import { Gpio, Low, High } from 'onoff';
import { MeasurmentAttributes } from "../models/measurement.model";

/**
 * registers every blink and saves it into storage
 */
export class BlinkService {


    public measure(storage:StorageService) {
        const photo = new Gpio(17, 'in', 'both', { debounceTimeout: 2 })
        let start = -1;
        let stop = -1;
        let ledOn = false;
        const data: MeasurmentAttributes ={timestamp:-1, blinkDuration:-1};
        photo.watch((err, value) => {
            if (err) throw err;
            if (value === 1 && !ledOn) {
                start = new Date().valueOf();
                data.timestamp = start ;
                ledOn = true;
            } else if (value === 0 && ledOn) {

                stop = new Date().valueOf();
                data.blinkDuration = stop - start;
                storage.createMeasurement(data)
                ledOn = false;
            }
        })
        process.on('SIGINT', () => {
            photo.unexport();
        })
    }

    public emulate(intervall: number, storage: StorageService) {
        setInterval(this._generateMeasurements, intervall, storage)
    }

    private _generateMeasurements(storage: StorageService) {
        storage.createMeasurementFromValues(new Date().valueOf(), Math.floor(Math.random() * 50))
    }
}