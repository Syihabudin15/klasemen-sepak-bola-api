import { DB, DataTypes, Op } from "../Configs/DbConnection.js";
import { Point } from './Point.js';
import { DetailPertandingan } from "./DetailPertandingan.js";

const TransaksiPoint = DB.define('', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    status: {type: DataTypes.STRING, allowNull: false}
});

TransaksiPoint.belongsTo(Point);
Point.hasMany(TransaksiPoint);

TransaksiPoint.belongsTo(DetailPertandingan);
DetailPertandingan.hasOne(TransaksiPoint);

await TransaksiPoint.sync();
export { TransaksiPoint, Op };