import knex from 'knex';
const config = {
  client: 'pg',
    connection:"postgresql://kalvium_owner:JBUcD8VqCNH0@ep-hidden-wind-a1d23dxj.ap-southeast-1.aws.neon.tech/test?sslmode=require",
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