import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { mapOptionFieldNames } from "sequelize/types/lib/utils";



interface MeasurmentAttributes {
    id: number;
    timestamp: number;
    blinkDuration: number;
    transmitted?: boolean;
}


export interface MeasurementCreationAttributes extends Optional<MeasurmentAttributes, "id"> { }

export class Measurement extends Model<MeasurmentAttributes, MeasurementCreationAttributes>
    implements MeasurmentAttributes {

    public id: number;
    public timestamp: number;
    public blinkDuration: number;
    public transmitted?: boolean;


    public static initialize(sequelize : Sequelize){
        Measurement.init({
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            timestamp: {type: DataTypes.BIGINT},
            blinkDuration:{type: DataTypes.INTEGER},
            transmitted: {type:DataTypes.BOOLEAN,defaultValue:false}
        },{sequelize, timestamps: false})
    }
}