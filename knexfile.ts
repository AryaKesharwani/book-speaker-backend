import type { Knex } from "knex";
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection:"postgresql://kalvium_owner:JBUcD8VqCNH0@ep-hidden-wind-a1d23dxj.ap-southeast-1.aws.neon.tech/test?sslmode=require",
    migrations: {
      directory: "./src/migrations",
    },
  },
};

export default config;