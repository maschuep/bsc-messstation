import { StorageService } from "./storage.service";
import { Gpio } from 'onoff'

/**
 * registers every blink and saves it into storage
 */
export class BlinkService{

    private _stop: boolean = false;


    public measure(){
        const input = new Gpio(0, 'in')
    }

    public emulate(intervall:number, storage:StorageService){
        setInterval(this._generateMeasurements,intervall,storage)
    }

    private _generateMeasurements(storage: StorageService){
        storage.createMeasurement(Math.floor(Math.random() * 1000000), Math.floor(Math.random() * 100))
    }
}