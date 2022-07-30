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
const { Pool } = require("pg");
//!PostgreSQL connection
const pool = new Pool();
module.exports = {
    query(text, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // invocation timestamp for the query method
            const start = Date.now();
            try {
                const res = yield pool.query(text, params);
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
        });
    },
};
// text will be something like 'SELECT * FROM $1'
// params something like this array: ['users'] i.e. the table name
// $1 => replaced by users in final query
