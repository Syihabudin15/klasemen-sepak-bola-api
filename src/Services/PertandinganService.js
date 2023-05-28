import { CustomError } from "../Configs/CustomError.js";
import { Pertandingan, DB, Op } from '../Entities/Pertandingan.js';
import { DetailPertandingan } from '../Entities/DetailPertandingan.js';
import { GetKlubById } from "./KlubService.js";


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
                break;
            }
        }
        
        let pertandingan = await Pertandingan.create({}, {t});
        let detail = await DetailPertandingan.bulkCreate([
            {mPertandinganId: pertandingan.id, mKlubId: findKlub1.id},
            {mPertandinganId: pertandingan.id, mKlubId: findKlub2.id}
        ], {t});

        await t.commit();
        res.status(201).json({msg: 'Pertandingan berhasil dibuat', statusCode: 201, pertandingan: {pertandingan, detail}});
    }catch(err){
        t.rollback();
        return CustomError(res, 404, err.message);
    }
};