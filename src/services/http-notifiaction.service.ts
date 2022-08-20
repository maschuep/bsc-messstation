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
    
    /**
     * Takes the last unsent measurements and aggreages them over before sending
     */

    notifyAggregated(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            // read the configuration of the intervall for the aggregation
            const intervall = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10);
            // stop if there is no new measurements
            if (!all || all.length <= 0) return;
            const startValue = all[0]
            type b = { timestamp: number, wh: number };
            // reduce the measurements to the configured intervall
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
            
            // send the data to the backend
            BscBackendService.sendData(JSON.stringify(aggregated))
                .then((ans) => console.log(`${new Date().toLocaleString()} sent: ${all.length} wh`))
                .catch((err) => {
                    storage.transmissionFailed(all);
                    console.log(new Date().toLocaleString(), err)
                })



        }).catch(err => { console.log(err) })
    }
}
