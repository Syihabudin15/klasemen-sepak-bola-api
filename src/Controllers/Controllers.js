import Express from "express";
import { SaveKlub, GetAllKlub, GetAllKlubPagination } from '../Services/KlubService.js';
import { SavePertandingan } from "../Services/PertandinganService.js";
import { CreateTransaksiPoint } from '../Services/TransaksiPointService.js';
const Routers = Express.Router();

// Klub Controller
Routers.post('/klub', SaveKlub);
Routers.get('/klub', GetAllKlub);
Routers.get('/klub/find', GetAllKlubPagination);

// Pertandingan Controller
Routers.post('/pertandingan', SavePertandingan);
Routers.post('/pertandingan/update', CreateTransaksiPoint);


export default Routers;