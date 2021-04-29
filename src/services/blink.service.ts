import { StorageService } from "./storage.service";
import { Gpio, Low, High } from 'onoff';

/**
 * registers every blink and saves it into storage
 */
export class BlinkService{

    public measure(){
        const led = new Gpio(0, 'in', 'both', {debounceTimeout:10})
        let start = 0
        led.watch((err, value) => {
            if(err) throw err;
            if(value === 1){
                start = new Date().valueOf()
            }else if(value === 0){
                console.log('blinked for: ', start - new Date().valueOf(), ' ms')
            }
        })


        process.on('SIGINT', () => {
            led.unexport();
        })
    }

    public emulate(intervall:number, storage:StorageService){
        setInterval(this._generateMeasurements,intervall,storage)
    }

    private _generateMeasurements(storage: StorageService){
        storage.createMeasurement(new Date().valueOf(), Math.floor(Math.random() * 50))
    }
}