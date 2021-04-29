import jwt from 'jsonwebtoken'
export class JWTService {

    public static tokenForMeasurements(): string {
        const secret = process.env.JWT_STATION_SECRET;
        const participant = process.env.PARTICIPANT;
        return jwt.sign({ participant }, secret, { expiresIn: '1h' })
    }

}