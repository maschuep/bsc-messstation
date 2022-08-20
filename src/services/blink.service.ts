import { StorageService } from "./storage.service";
import { Gpio, Low, High } from 'onoff';
import { MeasurmentAttributes } from "../models/measurement.model";


export class BlinkService {

/**
 * registers every blink and saves it into storage
 */
    public measure(storage:StorageService) {
        // configure pin
        const photo = new Gpio(17, 'in', 'both', { debounceTimeout: 30 })
        let start = -1;
        let stop = -1;
        let ledOn = false;
        // data object to save value, blinkDuration is used to find false positives
        const data: MeasurmentAttributes ={timestamp:-1, blinkDuration:-1};
        // listen on pin for a signal of the photoresistor
        photo.watch((err, value) => {
            if (err) throw err;
            // if blinking starts
            if (value === 1 && !ledOn) {
                start = new Date().valueOf();
                data.timestamp = start ;
                ledOn = true;
                
            }
            // if blinking ends
            else if (value === 0 && ledOn) {
              
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

    /* blinking emulation for testing and developement purposes
     *
     */
    public emulate(intervall: number, storage: StorageService) {
        setInterval(this._generateMeasurements, intervall, storage)
    }

    private _generateMeasurements(storage: StorageService) {
        storage.createMeasurementFromValues(new Date().valueOf(), Math.floor(Math.random() * 50))
    }
}
