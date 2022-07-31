//import path from "path";
const { Pool } = require("pg");
//import { migrate } from "postgres-migrations";

class Database {
  pool: typeof Pool;

  constructor() {
    this.pool = new Pool();
  }
  /*
  runMigrations = async (): Promise<void> => {
    const client = await this.pool.connect();
    try {
      await migrate({ client }, path.resolve(__dirname, "migrations/sql"));
      console.error("migation ok");
    } catch (err) {
      console.error("migation failes", err);
    } finally {
      client.release();
    }
  };
  */

  query = async (text: string, params: Array<any>): Promise<any> => {
    // invocation timestamp for the query method
    const start = Date.now();
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      // time elapsed since invocation to execution
      const duration = Date.now() - start;
      console.log("executed query<", text, ">", {
        text,
        duration,
        rows: res.rowCount,
      });
      return res;
    } catch (error) {
      console.log("error in query!!!<", text, ">");
      throw error;
    } finally {
      client.release();
    }
  };
}

export default Database;
