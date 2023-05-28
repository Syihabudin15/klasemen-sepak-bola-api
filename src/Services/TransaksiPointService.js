import { TransaksiPoint, DB } from '../Entities/TransaksiPoint.js';
import { CustomError } from '../Configs/CustomError.js';
import { GetDetailPertandinganByPertandinganId, UpdateSkor } from './DetailPertandinganService.js';
import { UpdatePoint } from './PointService.js';
import { UpdateStatusPertandingan } from './PertandinganService.js';

export async function CreateTransaksiPoint(req, res){
    const pertandinganId = req.query.id;
    const skors = req.body.skors;
    const t = await DB.transaction();
    try{
        if(!pertandinganId) return CustomError(res, 400, 'Parameter Id harus diiisi');
        const detail = await GetDetailPertandinganByPertandinganId(pertandinganId);
        await UpdateStatusPertandingan(pertandinganId);

        let tmp = skors[1];
        for(let i = 0; i < skors.length; i++){
            for(let j = 0; j < detail.length; j++){
                console.log(detail[i].id);
                if(detail[i].id === skors[j].id){
                    await UpdateSkor(detail[i].id, skors[j].skor);
                    if(skors[i].skor > tmp.skor){
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, detail[i].id, 'MENANG', detail[i].mKlubId);
                    }else if(skors[i].skor < tmp.skor){
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, detail[i].id, 'KALAH', detail[i].mKlubId);
                    }else{
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, detail[i].id, 'SERI', detail[i].mKlubId);
                    }
                }
            }
            tmp = skors[0];
        }

        await t.commit();
        res.status(201).json({msg: 'Update Skor dan Point berhasil', statusCode: 201, data: detail});
    }catch(err){
        t.rollback();
        console.log(err);
        return CustomError(res, 500, err.message);
    }
};

async function SetWinnerAndLoser(pointId, detailId, status, klubId){
    try{
        await TransaksiPoint.create({mPointId: pointId, mDetailPertandinganId: detailId, status: status});
        await UpdatePoint(klubId, status);
    }catch(err){
        throw Error(err.message);
    }
};