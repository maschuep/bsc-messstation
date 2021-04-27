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


}