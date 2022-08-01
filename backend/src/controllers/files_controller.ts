import { Dato } from "../models/Dato";
import Database from "../db/index";
let db: Database = new Database();

exports.test = async () => {
  try {
    const { rows } = await db.query(`select 1 as test`, []);
    //console.log(rows);
    return rows;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.getPendingData = async (limit?: number) => {
  try {
    let limitQuery: string = limit ? `limit ${limit}` : "";
    const { rows } = await db.query(
      `select * from datiDaProcessare order by P desc, dataora desc ${limitQuery}`,
      []
    );
    //console.log(rows);
    return rows;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};
exports.getDataProcessed = async (req: any) => {
  try {
    let from = req.query.from;
    let limit = req.query.limit;
    console.log("PARAMS:", from, limit);
    if (!from || isNaN(from)) from = "";
    if (!limit || isNaN(limit) || limit <= 0) limit = "";
    let fromQuery: string =
      from === "" ? "" : `where timestampDataOra >= ${from}`;
    let limitQuery: string = limit === "" ? "" : "limit " + limit;

    const { rows } = await db.query(
      `select id,k,d,timestampDataOra as dataora from datiProcessati  ${fromQuery} order by dataora desc ${limitQuery} `,
      []
    );

    //const { rows } = await db.query(`select 'ciao' as id`, []);

    //console.log(rows);
    return rows;
  } catch (error) {
    //pass error to next()
    throw error;
  }
};

exports.setPendingData = async (req: any) => {
  const { fileBase64 } = req.body;
  const lines: Array<Dato> = getDatiOfBase64File(fileBase64);
  try {
    console.log("fileBase64:", fileBase64);
    await db.query("BEGIN", []);

    const rows = await insertDati(lines);

    await db.query("COMMIT", []);

    console.log("All Insert done! Rows affected:", rows);
    return fileBase64;
  } catch (error) {
    await db.query("ROLLBACK", []);
    throw error;
  }
};

const insertDati = async (listaRighe: Array<Dato>) => {
  let countRows = 0;
  for (let i = 0; i < listaRighe.length; i++) {
    const { priority: P, K, D } = listaRighe[i];
    console.log("P:", P, "K:", K, "D:", D);
    const { rows } = await db.query(
      `insert into datiDaProcessare(id,P,K,D,dataora) values (nextval('serialDatiDaProcessare'),$1,$2,$3,now())`,
      [P, K, D]
    );
    countRows += rows;
  }
  return countRows;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

exports.processaBlocco = async (listaRighe: Array<Dato>) => {
  try {
    const timestampBlocco: Date = new Date();
    console.log("INIZIO BLOCCO: ", timestampBlocco.getTime());
    await db.query("BEGIN", []);

    //console.log("wait 5 seconds");
    //await delay(5000);

    console.log("doElaborartion START");
    await doElaborartion(listaRighe, timestampBlocco);
    console.log("doElaborartion END");

    await db.query("COMMIT", []);
  } catch (e) {
    await db.query("ROLLBACK", []);
    throw e;
  }
};

const doElaborartion = async (listaRighe: Array<Dato>, timestamp: Date) => {
  console.log("start");
  let current = timestamp;
  for (let i = 0; i < listaRighe.length; i++) {
    const dato: Dato = listaRighe[i];

    await db.query(
      `insert into datiProcessati(id,K,D,dataora) values ($1,$2,$3,$4)`,
      [dato.id, dato.K, dato.D, current]
    );

    await db.query(`delete from datiDaProcessare where id = $1`, [dato.id]);
  }

  console.log("end");
};

const getDatiOfBase64File = (fileBase64: string): Array<Dato> => {
  const lineeFile: Array<Dato> = [];
  const buff = Buffer.from(fileBase64, "base64");
  const text = buff.toString("utf8");
  console.log("FILE:", text);
  const linee = text.split("\n");
  const intestazione = linee[0];
  const [a, b] = intestazione.split(" ");
  const A = a as unknown as number;
  const B = b as unknown as number;
  console.log("A:", A, "B:", B);
  for (let i = 1; i < linee.length; i++) {
    if (i >= A && i <= B && linee[i] != "") {
      let array = linee[i].split(" ");
      let p = array[0],
        k = array[1];
      array.shift();
      array.shift();
      let d = array.join(" ");
      let P: number = p as unknown as number;
      let K: number = k as unknown as number;
      let D: string = d;

      lineeFile.push(new Dato(P, K, D));
    }
  }
  return lineeFile;
};
