import { DB, DataTypes, Op } from '../Configs/DbConnection.js';
import { Klub } from './Klub.js';

const Point = DB.define('m_point', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    point: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
}, {createdAt: false, updatedAt: false});

Point.belongsTo(Klub);
Klub.hasOne(Point);

await Point.sync();
export { Point, Op };