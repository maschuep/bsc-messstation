import { BlinkService } from './services/blink.service';
import { NotificationService } from './services/notifiaction.service';
import { StorageService } from './services/storage.service'
import dotenv from 'dotenv';

dotenv.config();
const intervall: number = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10)
const notificationIntervall: number = Number.parseInt(process.env.NOTIFICATION_INTERVALL, 10)

const storage = new StorageService();
const notifier = new NotificationService();
const blink = new BlinkService();

setInterval(notifier.notify, notificationIntervall, storage)

if(process.env.ENVIRONMENT === 'dev'){
    blink.emulate(intervall, storage);
}else if(process.env.ENVIRONMENT === 'rpi'){
    blink.measure();
}else{
    throw new Error('environment must be "dev" or "rpi"')
}