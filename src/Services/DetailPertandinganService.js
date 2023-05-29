import { DetailPertandingan} from "../Entities/DetailPertandingan.js";
import { Klub } from "../Entities/Klub.js";
import { Point } from "../Entities/Point.js";

export async function SaveDetailPertandingan(klubId1, klubId2, pertandinganId){
    try{
        let result = await DetailPertandingan.bulkCreate([
            {mPertandinganId: pertandinganId, mKlubId: klubId1},
            {mPertandinganId: pertandinganId, mKlubId: klubId2}
        ]);
        return result;
    }catch{
        throw Error('Gagal membuat data Detail Pertandingan');
    }
};

export async function UpdateSkor(id, skor){
    try{
        let find = await DetailPertandingan.findOne({where: {id: id}});
        find.skor = skor;
        find.mPertandinganId = find.mPertandinganId;
        await find.save();
    }catch{
        throw Error('Gagal Update Skor Pertandingan');
    }
}

export async function GetDetailPertandinganByPertandinganId(id){
    const find = await DetailPertandingan.findAll({
        where: {mPertandinganId: id},
        include: [{
            model: Klub,
            include:[{
                model: Point
            }]
        }]
    });
    if(find.length === 0) throw Error('Detail Pertandingan tidak ditemukan');
    return find;
}