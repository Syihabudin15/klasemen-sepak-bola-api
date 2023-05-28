import { DB, DataTypes, Op } from "../Configs/DbConnection.js";

const Pertandingan = DB.define('m_pertandingan', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    selesai: {type: DataTypes.BOOLEAN, defaultValue: false},
    updated: {type: DataTypes.BOOLEAN, defaultValue: false}
});

await Pertandingan.sync();
export { Pertandingan, Op, DB };