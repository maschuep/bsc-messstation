
import http from 'http'
import { JWTService } from "./jwt.service";

export class BscBackendService {



    static sendData(data: string): Promise<string> {
        return new Promise((resolve, reject) => {
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
                    reject(err)
                });
            })

            req.on("error", (err) => {
                reject(err)
            })

            req.write(data);
            req.on('finish', (a) => {
                resolve(a);
            });
            req.on('on', (a) => {
                resolve(a);
            });
            req.end();
        })
    }
}