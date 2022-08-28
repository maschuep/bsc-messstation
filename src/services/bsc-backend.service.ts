import http from 'http'
import { JWTService } from "./jwt.service";

export class BscBackendService {

    static sendData(data: string): Promise<string> {

        return new Promise((resolve, reject) => {
            
            // read the config from the config file
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

            // create the request and define success and error scenarios
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
            
            //send request
            req.write(data);
            // finish request
            req.end();
        })
    }
}
