import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sessions', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.time('startTime').notNullable();
    table.time('endTime').notNullable();
    table.integer('userId').unsigned().references('id').inTable('users');
    table.integer('speakerId').unsigned().references('id').inTable('speakers');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('sessions');
}