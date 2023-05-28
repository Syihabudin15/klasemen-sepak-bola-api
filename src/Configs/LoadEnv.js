import {} from 'dotenv/config';

export const port = process.env.PORT || 5000;

// Database Environtment
export const db_name = process.env.DB_NAME || 'klasemen_sepak_bola';
export const db_host = process.env.DB_HOST || 'localhost';
export const db_user = process.env.BD_USER || 'root';
export const db_pass = process.env.DB_PASS || '';
export const db_port = process.env.DB_PORT || 3306;
export const db_dialect = process.env.DB_DIALECT || 'mysql';