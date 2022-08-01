"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import path from "path";
const { Pool } = require("pg");
//import { migrate } from "postgres-migrations";
class Database {
    constructor() {
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
        this.query = (text, params) => __awaiter(this, void 0, void 0, function* () {
            // invocation timestamp for the query method
            const start = Date.now();
            const client = yield this.pool.connect();
            try {
                const res = yield client.query(text, params);
                // time elapsed since invocation to execution
                const duration = Date.now() - start;
                console.log("executed query<", text, ">", {
                    text,
                    duration,
                    rows: res.rowCount,
                });
                return res;
            }
            catch (error) {
                console.log("error in query!!!<", text, ">");
                throw error;
            }
            finally {
                client.release();
            }
        });
        this.pool = new Pool();
    }
}
exports.default = Database;
