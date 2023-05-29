import { CustomError } from "../Configs/CustomError.js";
import { Pertandingan, DB } from '../Entities/Pertandingan.js';
import { DetailPertandingan } from '../Entities/DetailPertandingan.js';
import { GetKlubById } from "./KlubService.js";
import { SaveDetailPertandingan } from "./DetailPertandinganService.js";

export async function SavePertandingan(req, res){
    const {klub1, klub2} = req.body;
    const t = await DB.transaction();
    try{
        let findKlub1 = await GetKlubById(klub1);
        let findKlub2 = await GetKlubById(klub2);

        let findDetail = await Pertandingan.findAll({
            include: [{
                model: DetailPertandingan
            }]
        });
        for(let i = 0; i < findDetail.length; i++){
            let detail = findDetail[i].m_detail_pertandingans;
            if((detail[0].mKlubId == findKlub1.id && detail[1].mKlubId == findKlub2.id) ||
            (detail[1].mKlubId == findKlub1.id && detail[0].mKlubId == findKlub2.id)){
                return CustomError(res, 403, 'Data Pertandingan sudah pernah dibuat');
            }else{
                continue;
            }
        }
        
        let pertandingan = await Pertandingan.create({selesai: false}, {t});
        let detail = await SaveDetailPertandingan(findKlub1.id, findKlub2.id, pertandingan.id);

        await t.commit();
        res.status(201).json({msg: 'Pertandingan berhasil dibuat', statusCode: 201, pertandingan: {pertandingan, detail}});
    }catch(err){
        t.rollback();
        return CustomError(res, 404, err.message);
    }
};

export async function UpdateStatusPertandingan(id){
    try{
        let find = await Pertandingan.findOne({where: {id: id}});
        if(find.updated === true) throw Error('Maaf data sudah pernah dirubah');

        find.selesai = true;
        find.updated = true;
        await find.save();
    }catch{
        throw Error('Gagal update status Pertandingan');
    }
};

export async function GetAllHistoryPertandingan(req, res){
    try{
        const result = await Pertandingan.findAll({
            where: {selesai: true},
            include: [{model: DetailPertandingan}]
        });
        res.status(200).json({msg: 'berhasil ambil data riwayat pertandingan', statusCode: 200, data: result});
    }catch(err){
        return CustomError(res, 500);
    }
};

export async function GetAllActivePertandingan(req, res){
    try{
        const result = await Pertandingan.findAll({
            where: {selesai: false},
            include: [{model: DetailPertandingan}]
        });
        res.status(200).json({msg: 'berhasil ambil data riwayat pertandingan', statusCode: 200, data: result});
    }catch(err){
        return CustomError(res, 500);
        
    }
};