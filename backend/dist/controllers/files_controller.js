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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dato_1 = require("../models/Dato");
const index_1 = __importDefault(require("../db/index"));
let db = new index_1.default();
exports.test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield db.query(`select 1 as test`, []);
        //console.log(rows);
        return rows;
    }
    catch (error) {
        //pass error to next()
        throw error;
    }
});
exports.getPendingData = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let limitQuery = limit ? `limit ${limit}` : "";
        const { rows } = yield db.query(`select * from datiDaProcessare order by P desc, dataora desc ${limitQuery}`, []);
        //console.log(rows);
        return rows;
    }
    catch (error) {
        //pass error to next()
        throw error;
    }
});
exports.getDataProcessed = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let from = req.query.from;
        let limit = req.query.limit;
        console.log("PARAMS:", from, limit);
        if (!from || isNaN(from))
            from = "";
        if (!limit || isNaN(limit) || limit <= 0)
            limit = "";
        let fromQuery = from === "" ? "" : `where timestampDataOra >= ${from}`;
        let limitQuery = limit === "" ? "" : "limit " + limit;
        const { rows } = yield db.query(`select id,k,d,timestampDataOra as dataora from datiProcessati  ${fromQuery} order by dataora desc ${limitQuery} `, []);
        //const { rows } = await db.query(`select 'ciao' as id`, []);
        //console.log(rows);
        return rows;
    }
    catch (error) {
        //pass error to next()
        throw error;
    }
});
exports.setPendingData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileBase64 } = req.body;
    const lines = getDatiOfBase64File(fileBase64);
    try {
        console.log("fileBase64:", fileBase64);
        yield db.query("BEGIN", []);
        const rows = yield insertDati(lines);
        yield db.query("COMMIT", []);
        console.log("All Insert done! Rows affected:", rows);
        return fileBase64;
    }
    catch (error) {
        yield db.query("ROLLBACK", []);
        throw error;
    }
});
const insertDati = (listaRighe) => __awaiter(void 0, void 0, void 0, function* () {
    let countRows = 0;
    for (let i = 0; i < listaRighe.length; i++) {
        const { priority: P, K, D } = listaRighe[i];
        console.log("P:", P, "K:", K, "D:", D);
        const { rows } = yield db.query(`insert into datiDaProcessare(id,P,K,D,dataora) values (nextval('serialDatiDaProcessare'),$1,$2,$3,now())`, [P, K, D]);
        countRows += rows;
    }
    return countRows;
});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
exports.processaBlocco = (listaRighe) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timestampBlocco = new Date();
        console.log("INIZIO BLOCCO: ", timestampBlocco.getTime());
        yield db.query("BEGIN", []);
        //console.log("wait 5 seconds");
        //await delay(5000);
        console.log("doElaborartion START");
        yield doElaborartion(listaRighe, timestampBlocco);
        console.log("doElaborartion END");
        yield db.query("COMMIT", []);
    }
    catch (e) {
        yield db.query("ROLLBACK", []);
        throw e;
    }
});
const doElaborartion = (listaRighe, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("start");
    let current = timestamp;
    for (let i = 0; i < listaRighe.length; i++) {
        const dato = listaRighe[i];
        yield db.query(`insert into datiProcessati(id,K,D,dataora) values ($1,$2,$3,$4)`, [dato.id, dato.K, dato.D, current]);
        yield db.query(`delete from datiDaProcessare where id = $1`, [dato.id]);
    }
    console.log("end");
});
const getDatiOfBase64File = (fileBase64) => {
    const lineeFile = [];
    const buff = Buffer.from(fileBase64, "base64");
    const text = buff.toString("utf8");
    console.log("FILE:", text);
    const linee = text.split("\n");
    const intestazione = linee[0];
    const [a, b] = intestazione.split(" ");
    const A = a;
    const B = b;
    console.log("A:", A, "B:", B);
    for (let i = 1; i < linee.length; i++) {
        if (i >= A && i <= B && linee[i] != "") {
            let array = linee[i].split(" ");
            let p = array[0], k = array[1];
            array.shift();
            array.shift();
            let d = array.join(" ");
            let P = p;
            let K = k;
            let D = d;
            lineeFile.push(new Dato_1.Dato(P, K, D));
        }
    }
    return lineeFile;
};
