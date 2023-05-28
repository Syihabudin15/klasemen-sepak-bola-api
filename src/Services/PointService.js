import { Point } from "../Entities/Point.js";

export async function SavePoint(klubId){
    try{
        let result = await Point.create({mKlubId: klubId});
        return result;
    }catch{
        throw Error('Gagal Membuat data Point Klub');
    }
};

export async function UpdatePoint(klubId, status){
    try{
        let point = await Point.findOne({
            where: {mKlubId: klubId}
        });
        if(!point) throw Error('Point Klub Tidak Ditemukan');
        switch(status){
            case "MENANG":
                point.point += 3;
            case "SERI":
                point.point += 1;
            default:
                point.point += 0;
            
        };
        await point.save();
        return point;
    }catch{
        throw Error('Gagal Update point Klub');
    }
};