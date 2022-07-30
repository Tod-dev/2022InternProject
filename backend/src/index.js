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
const express_1 = __importDefault(require("express"));
const Dato_1 = require("./models/Dato");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require('node-cron');
const files_controller = require("./controllers/files_controller");
const app = (0, express_1.default)();
dotenv.config();
app.use(cors());
app.use(express_1.default.json());
app.post('/importDataFromFile', (req, res) => {
    let message = 'POST importDataFromFile';
    console.log(message);
    files_controller
        .setPendingData(req)
        .then((response) => {
        //console.log("RESPONSE:", response);
        res.status(200).send(response);
    })
        .catch((error) => {
        console.log("ERROR:", error);
        res.status(500).send(error);
    });
});
app.get('/pendingData', (req, res) => {
    let message = 'GET pendingDa';
    console.log(message);
    files_controller
        .getPendingData()
        .then((response) => {
        //console.log("RESPONSE:", response);
        res.status(200).send(response);
    })
        .catch((error) => {
        console.log("ERROR:", error);
        res.status(500).send(error);
    });
});
app.get('/data', (req, res) => {
    let message = 'GET data';
    console.log(message);
    files_controller
        .getDataProcessed(req)
        .then((response) => {
        //console.log("RESPONSE:", response);
        res.status(200).send(response);
    })
        .catch((error) => {
        console.log("ERROR:", error);
        res.status(500).send(error);
    });
});
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
var cronjob = cron.schedule('*/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Task is running every 10s -" + new Date());
    yield task();
}), {
    scheduled: false,
});
app.listen(process.env.PORT || 3001, () => {
    console.log("started");
    cronjob.start();
});
const task = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pendingdata = yield files_controller.getPendingData(15);
        let listaRighe = [];
        let listaIdFiles = [];
        for (let i = 0; i < pendingdata.length; i++) {
            const { id, p, k, d, dataora } = pendingdata[i];
            const dato = new Dato_1.Dato(p, k, d, id);
            listaIdFiles.push(dato.id);
            listaRighe.push(dato);
        }
        console.log("Processo dati con id:", listaIdFiles);
        console.log("righe selezionate:", listaRighe);
        if (listaIdFiles.length > 0 && listaRighe.length > 0)
            yield files_controller.processaBlocco(listaRighe);
    }
    catch (err) {
        throw err;
    }
});
