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
                res.on("end", () => {
                    if (res.statusCode !== 201) {
                        console.log('zäggs')
                        Promise.reject(`Error: ${res.statusCode}`);
                    }
                    console.log(res.statusCode);
                    resolve('')
                })
            })
                .on("error", (err) => {
                    reject(new Error(err.toString()))

                })
                .on('response', (res) => {
                    if (res.statusCode !== 201) {
                        reject(new Error(res.statusCode.toString()));

                    }
                })
                .on('finish', (done) => {

                    resolve(done)


                })
            req.write(data);
            req.end();
        })
    }
}