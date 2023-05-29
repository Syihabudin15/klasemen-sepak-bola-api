import Express from "express";
import { SaveKlub, GetAllKlub, GetKlasemen } from '../Services/KlubService.js';
import { GetAllActivePertandingan, GetAllHistoryPertandingan, SavePertandingan } from "../Services/PertandinganService.js";
import { BulkCreateTransaksiPoint, CreateTransaksiPoint } from '../Services/TransaksiPointService.js';
const Routers = Express.Router();

// Klub Controller
Routers.post('/klub', SaveKlub);
Routers.get('/klub', GetAllKlub);
Routers.get('/klasemen', GetKlasemen);

// Pertandingan Controller
Routers.post('/pertandingan', SavePertandingan);
Routers.post('/pertandingan/update', CreateTransaksiPoint);
Routers.post('/pertandingan/update/bulk', BulkCreateTransaksiPoint);
Routers.get('/pertandingan/aktif', GetAllActivePertandingan);
Routers.get('/pertandingan/riwayat', GetAllHistoryPertandingan);


export default Routers;