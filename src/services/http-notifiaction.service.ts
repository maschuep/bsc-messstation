import { Measurement, MeasurmentAttributes } from "../models/measurement.model";
import { StorageService } from "./storage.service";
import http from 'http'
import { JWTService } from "./jwt.service";
import { start } from "node:repl";

/**
 * notifies the backend in a certain time intervall about the measurements
 */
export class HttpNotificationService {

    notifyDetailed(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data = JSON.stringify(all);
                HttpNotificationService._sendData(all, data,storage);
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
            HttpNotificationService._sendData(all, JSON.stringify(aggregated), storage)
        })
    }

    public static _sendData(all: Measurement[], data: string, storage: StorageService) {

        const options = {
            hostname: process.env.BACKEND_URL,
            port: process.env.BACKEND_PORT,
            path: `/measurement/${process.env.PARTICIPANT}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Bearer ${JWTService.tokenForMeasurements()}`
            }
        }

        const req = http.request(options, res => {
            res.on("error", (err) => {
                storage.transmissionFailed(all);
                console.error(new Date().toISOString(), err);
            });
        })

        req.on("error", (err) => {
            storage.transmissionFailed(all);
            console.error(new Date().toISOString(), err);
        })

        req.write(data);
        req.on('finish', () => console.log(new Date().toISOString(), `sent: ${all.length} wh, size: ${data.length * 16 / 8} B`));
        req.end();
    }
}