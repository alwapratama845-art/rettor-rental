import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "alwa12",
  database: "rettor_db",
});

export default db;