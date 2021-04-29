import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { mapOptionFieldNames } from "sequelize/types/lib/utils";



export interface MeasurmentAttributes {
    timestamp: number;
    blinkDuration: number;
    transmitted?: boolean;
}

export class Measurement extends Model<MeasurmentAttributes, MeasurmentAttributes>
    implements MeasurmentAttributes {

    public timestamp!: number;
    public blinkDuration!: number;
    public transmitted?: boolean;


    public static initialize(sequelize : Sequelize){
        Measurement.init({
            timestamp: {type: DataTypes.BIGINT, primaryKey: true},
            blinkDuration:{type: DataTypes.INTEGER},
            transmitted: {type:DataTypes.BOOLEAN,defaultValue:false}
        },{sequelize, timestamps: false})
    }
}