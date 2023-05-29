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
                if(detail[i].id === skors[j].id){
                    await UpdateSkor(detail[i].id, skors[j].skor);
                    if(skors[i].skor > tmp.skor && skors[i].id !== tmp.id){
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, skors[j].id, 'MENANG', detail[i].mKlubId);
                    }else if(skors[i].skor < tmp.skor && skors[i].id  !== tmp.id){
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, skors[j].id, 'KALAH', detail[i].mKlubId);
                    }else{
                        await SetWinnerAndLoser(detail[i].m_klub.m_point.id, skors[j].id, 'SERI', detail[i].mKlubId);
                    }
                }
            }
            tmp = skors[0];
        }

        await t.commit();
        res.status(201).json({msg: 'Update Skor dan Point berhasil', statusCode: 201, data: detail});
    }catch(err){
        t.rollback();
        return CustomError(res, 500, err.message);
    }
};

export async function BulkCreateTransaksiPoint(req, res){
    const { pertandingans } = req.body;
    const t = await DB.transaction();
    try{
        if(pertandingans.length === 0) return CustomError(res, 400, 'Mohon isi Pertandingan');
        pertandingans.forEach(async (e) => {
            await UpdateStatusPertandingan(e.id);
            let detail = await GetDetailPertandinganByPertandinganId(e.id);
            
            let tmp = skors[1];
            for(let i = 0; i < e.skors.length; i++){
                for(let j = 0; j < detail.length; j++){
                    if(detail[i].id === e.skors[j].id){
                        await UpdateSkor(detail[i].id, e.skors[j].skor);
                        if(e.skors[i].skor > tmp.skor && e.skors[i].id !== tmp.id){
                            await SetWinnerAndLoser(detail[i].m_klub.m_point.id, e.skors[j].id, 'MENANG', detail[i].mKlubId);
                        }else if(skors[i].skor < tmp.skor && skors[i].id  !== tmp.id){
                            await SetWinnerAndLoser(detail[i].m_klub.m_point.id, e.skors[j].id, 'KALAH', detail[i].mKlubId);
                        }else{
                            await SetWinnerAndLoser(detail[i].m_klub.m_point.id, e.skors[j].id, 'SERI', detail[i].mKlubId);
                        }
                    }
                }
                tmp = skors[0];
            }
        });
        await t.commit();
        res.status(201).json({msg: 'Update Skor dan Point Berhasil', statusCode: 201});
    }catch(err){
        t.rollback();
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