"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNotificationService = void 0;
const bsc_backend_service_1 = require("./bsc-backend.service");
/**
 * notifies the backend in a certain time intervall about the measurements
 */
class HttpNotificationService {
    notifyDetailed(storage) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data = JSON.stringify(all);
                bsc_backend_service_1.BscBackendService.sendData(JSON.stringify(all))
                    .then(() => console.log(`sent: ${all.length} wh`))
                    .catch((err) => {
                    storage.transmissionFailed(all);
                    console.log(new Date().toLocaleString(), err);
                });
            }
        });
    }
    notifyAggregated(storage) {
        storage.getAllUntransmitted().then(all => {
            const intervall = Number.parseInt(process.env.MEASUREMENT_INTERVALL, 10);
            if (!all || all.length <= 0)
                return;
            const startValue = all[0];
            const aggregated = all.reduce((acc, curr) => {
                const latestMeasurement = acc.pop();
                if (latestMeasurement.timestamp + intervall >= curr.timestamp) {
                    latestMeasurement.wh++;
                    acc.push(latestMeasurement);
                }
                else {
                    acc.push(latestMeasurement);
                    acc.push({ timestamp: latestMeasurement.timestamp + intervall, wh: 1 });
                }
                return acc;
            }, [{ timestamp: startValue.timestamp, wh: 0 }]);
            bsc_backend_service_1.BscBackendService.sendData(JSON.stringify(aggregated))
                .then(() => console.log(`${new Date().toLocaleString()} sent: ${all.length} wh`))
                .catch((err) => {
                storage.transmissionFailed(all);
                console.log(new Date().toLocaleString, err);
            });
        });
    }
}
exports.HttpNotificationService = HttpNotificationService;
//# sourceMappingURL=http-notifiaction.service.js.map