import { BlinkService } from './services/blink.service';
import { HttpNotificationService } from './services/http-notifiaction.service';
import { StorageService } from './services/storage.service'
import dotenv from 'dotenv';
import { BscBackendService } from './services/bsc-backend.service';

dotenv.config();
const intervall: number = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10)
const notificationIntervall: number = Number.parseInt(process.env.NOTIFICATION_INTERVALL, 10)

const storage = new StorageService();
const notifier = new HttpNotificationService();
const blink = new BlinkService();

setInterval(notifier.notifyAggregated, notificationIntervall, storage)

if(process.env.ENVIRONMENT === 'dev'){
    blink.emulate(intervall, storage);
}else if(process.env.ENVIRONMENT === 'rpi'){
    blink.measure(storage);
}else{
    throw new Error('environment must be "dev" or "rpi"')
}

console.log('station started ...')