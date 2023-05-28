import { DB, DataTypes, Op } from '../Configs/DbConnection.js';

const Klub = DB.define('m_klub', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    nama_klub: {type: DataTypes.STRING, allowNull: false, unique: true},
    kota_klub: {type: DataTypes.STRING, allowNull: false, unique: true}
}, {createdAt: false, updatedAt: false});

await Klub.sync();
export { Klub, Op };