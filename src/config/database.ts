import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'pg',
    connection:process.env.CONNECTION_STRING,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    // directory: 'src/middlewares',
  }
};


const db = knex(config);

export default db;