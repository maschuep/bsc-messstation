import { Sequelize } from 'sequelize';
import { Measurement } from '../models/measurement.model';
export class StorageService {

    private _sequelize;

    constructor() {

        this._sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false
        })

        Measurement.initialize(this._sequelize);
        this._sequelize.sync({alter: true}).catch(err => console.log(err));
    }

    createMeasurement(timestamp: number, blinkDuration: number): Promise<Measurement> {
        return Measurement.create({ timestamp, blinkDuration })
    }

    getAllUntransmitted(): Promise<Measurement[]> {
        return Measurement.findAll({where: {transmitted: false}})
        .then(ms => {
            ms.forEach(m => {
                m.transmitted = true;
                m.save();
            })
            return ms;
        })
    }

    transmissionFailed(measurements: Measurement[]){
        measurements.forEach(m => {
            m.transmitted = false;
            m.save();
        })
    }

}