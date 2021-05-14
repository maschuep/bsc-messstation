import { MeasurmentAttributes } from "../models/measurement.model";
import { StorageService } from "./storage.service";
import http from 'http'
import { JWTService } from "./jwt.service";

/**
 * notifies the backend in a certain time intervall about the measurements
 */
export class NotificationService {

    notify(storage: StorageService) {
        storage.getAllUntransmitted().then(all => {
            if (all && all.length > 0) {
                const data: string = JSON.stringify(all);
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
                        console.error(new Date().toISOString(),err);
                    });
                })
                req.on("error", (err) => {
                    storage.transmissionFailed(all);
                    console.error(new Date().toISOString(),err);
                })
                req.write(data);
                req.on('finish', () => console.log(new Date().toISOString(), `sent: ${all.length} wh, size: ${data.length * 16 / 8} B`));
                req.end();
            }
        })


    }
}