import { StorageService } from "./storage.service";

/**
 * notifies the backend in a certain time intervall about the measurements
 */
export class NotificationService {

    notify(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                console.log(all)
            }
        })
    }
}