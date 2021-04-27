import { StorageService } from "./storage.service";
import * as wiringpi from "wiring-pi"

/**
 * registers every blink and saves it into storage
 */
export class BlinkService{
    test(){
        console.log('hello from Blinkservice')
    }


    measure(){
        wiringpi.wiringPiSetup();
    }
}