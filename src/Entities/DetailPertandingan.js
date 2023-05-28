import { DB, DataTypes, Op } from "../Configs/DbConnection.js";
import { Klub } from './Klub.js';
import { Pertandingan } from "./Pertandingan.js";

const DetailPertandingan = DB.define('m_detail_pertandingan', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    skor: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
}, {createdAt: false, updatedAt: false});

DetailPertandingan.belongsTo(Klub);
Klub.hasMany(DetailPertandingan);

DetailPertandingan.belongsTo(Pertandingan);
Pertandingan.hasMany(DetailPertandingan);

await DetailPertandingan.sync();
export { DetailPertandingan, Op, DB };