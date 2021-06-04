import { StorageService } from "./storage.service";
import { BscBackendService } from "./bsc-backend.service";

/**
 * notifies the backend in a certain time intervall about the measurements
 */
export class HttpNotificationService {

    notifyDetailed(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data = JSON.stringify(all);
                BscBackendService.sendData(JSON.stringify(all))
                    .then(() => console.log(`sent: ${all.length} wh`))
                    .catch((err) => {
                        storage.transmissionFailed(all);
                        console.log(new Date().toLocaleString(), err)
                    });
            }
        })
    }

    notifyAggregated(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            const intervall = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10);
            if (!all || all.length <= 0) return;
            const startValue = all[0]
            type b = { timestamp: number, wh: number };
            const aggregated = all.reduce((acc: b[], curr) => {
                const latestMeasurement = acc.pop();
                if (latestMeasurement.timestamp + intervall >= curr.timestamp) {
                    latestMeasurement.wh++;
                    acc.push(latestMeasurement);
                } else {
                    acc.push(latestMeasurement);
                    acc.push({ timestamp: latestMeasurement.timestamp + intervall, wh: 1 });
                }
                return acc;
            }, [{ timestamp: startValue.timestamp, wh: 0 }])

            BscBackendService.sendData(JSON.stringify(aggregated))
                .then((ans) => console.log(`${new Date().toLocaleString()} sent: ${all.length} wh`))
                .catch((err) => {
                    storage.transmissionFailed(all);
                    console.log(new Date().toLocaleString(), err)
                })



        }).catch(err => { console.log(err) })
    }
}