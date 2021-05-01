import { StorageService } from "./storage.service";
import { Gpio, Low, High } from 'onoff';

/**
 * registers every blink and saves it into storage
 */
export class BlinkService {

    public measure() {
        const photo = new Gpio(17, 'in', 'both', { debounceTimeout: 10 })
        let start, stop = -1;
        let ledOn = false;
        let data = '';
        photo.watch((err, value) => {
            if (err) throw err;
            if (value === 1 && !ledOn) {
                start = new Date().valueOf();
                data += start + ', ';
                ledOn = true;
            } else if (value === 0 && ledOn) {
                if (stop !== -1) {
                    data += `${start - stop}, `
                }
                stop = new Date().valueOf();
                data += `${stop - start}`
                console.log(data)
                data=''
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
        storage.createMeasurement(new Date().valueOf(), Math.floor(Math.random() * 50))
    }
}