import 'dotenv/config';


export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

    // credenciales de la base de datos
export const DB_HOST = process.env.DB_HOST || '';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || '';

export const secret_session = process.env.SECRET_SESSION || "secreto";
export const expire_session = process.env.EXPIRE_SESSION || "24h";