import Express from "express";
import { SaveKlub, GetAllKlub, GetAllKlubPagination } from '../Services/KlubService.js';
import { SavePertandingan } from "../Services/PertandinganService.js";

const Routers = Express.Router();

// Klub Controller
Routers.post('/klub', SaveKlub);
Routers.get('/klub', GetAllKlub);
Routers.get('/klub/find', GetAllKlubPagination);

// Pertandingan Controller
Routers.post('/pertandingan', SavePertandingan);


export default Routers;