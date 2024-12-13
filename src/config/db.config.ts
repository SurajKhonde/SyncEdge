
import * as dotenv from 'dotenv';

dotenv.config();

// Define a type for the database configuration
interface DBConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  PORT:string;
  DB: string;
  dialect: 'mysql';
  charset: 'utf8mb4';
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}
const config: DBConfig = {
  HOST: process.env.host || '',
  USER: process.env.user || '',
  PASSWORD: process.env.password || '',
  DB: process.env.db || '',
  PORT:process.env.port ||'',
  dialect: 'mysql',
  charset: 'utf8mb4',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default config;
