import express from 'express';
import { Dato } from './models/Dato';
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require('node-cron');

const files_controller = require("./controllers/files_controller");

const app = express()
dotenv.config();
app.use(cors());
app.use(express.json());

app.post('/importDataFromFile', (req,res) => {
  let message: string = 'POST importDataFromFile';
  console.log(message)
  files_controller
  .setPendingData(req)
  .then((response:any) => {
    //console.log("RESPONSE:", response);
    res.status(200).send(response);
  })
  .catch((error:any) => {
    console.log("ERROR:", error);
    res.status(500).send(error);
  });
})

app.get('/pendingData', (req,res)=> {
  let message: string = 'GET pendingDa';
  console.log(message)
  files_controller
  .getPendingData()
  .then((response:any) => {
    //console.log("RESPONSE:", response);
    res.status(200).send(response);
  })
  .catch((error:any) => {
    console.log("ERROR:", error);
    res.status(500).send(error);
  });
})

app.get('/data', (req,res)=> {
  let message: string = 'GET data';
  console.log(message)
  files_controller
  .getDataProcessed(req)
  .then((response:any) => {
    //console.log("RESPONSE:", response);
    res.status(200).send(response);
  })
  .catch((error:any) => {
    console.log("ERROR:", error);
    res.status(500).send(error);
  });
})

const unknownEndpoint = (req:any, res:any) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

var cronjob = cron.schedule('*/10 * * * * *', async () => {
  console.log("Task is running every 10s -" + new Date());
  await task();
},
{
  scheduled: false,}
);

app.listen(process.env.PORT || 3001, () => {
  console.log("started")
  cronjob.start();
})

const task = async() => {
  try{
    let pendingdata = await files_controller.getPendingData(15);
    let listaRighe:Array<Dato> = [];
    let listaIdFiles:Array<number> = [];

    for(let i = 0; i< pendingdata.length;i++){
      const {id,p,k,d,dataora} = pendingdata[i];
      const dato:Dato = new Dato(p,k,d,id);      
      listaIdFiles.push(dato.id);
      listaRighe.push(dato);
    }
    console.log("Processo dati con id:",listaIdFiles);
    console.log("righe selezionate:",listaRighe);

    if(listaIdFiles.length >0 && listaRighe.length >0)
      await files_controller.processaBlocco(listaRighe);
  }catch(err){
    throw err;
  }
};
