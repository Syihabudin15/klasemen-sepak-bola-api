import { Sequelize, DataTypes, Op } from "sequelize";
import { db_host, db_name, db_user, db_pass, db_port, db_dialect } from './LoadEnv.js';

const DB = new Sequelize(db_name, db_user, db_pass, {
    host: db_host,
    port: db_port,
    dialect: db_dialect
});

export { DB, DataTypes, Op };