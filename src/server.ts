import { BlinkService } from './services/blink.service';
import { NotificationService } from './services/notifiaction.service';
import { StorageService } from './services/storage.service'
import dotenv from 'dotenv'
import { Measurement } from './models/measurement.model';

dotenv.config();

const storage = new StorageService();
const notifier = new NotificationService();
const blink = new BlinkService();

setInterval(notifier.notify, 1000, storage)
