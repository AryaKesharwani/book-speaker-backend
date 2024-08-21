import type { Knex } from "knex";
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection:process.env.CONNECTION_STRING,
    migrations: {
      directory: "./src/migrations",
    },
  },
};

export default config;