import { DB, Klub, Op } from "../Entities/Klub.js";
import { Point } from '../Entities/Point.js';
import { CustomError } from '../Configs/CustomError.js';

export async function SaveKlub(req, res){
    const {nama_klub, kota_klub} = req.body;
    const t = await DB.transaction();
    try{
        let klub = await Klub.findOne({where: {
            [Op.or]:[
                {nama_klub: nama_klub},
                {kota_klub: kota_klub}
            ]
        }});
        if(!nama_klub || !kota_klub) return CustomError(res, 400, 'Nama Klub, Kota Klub harus Diisi');
        if(klub) return CustomError(res, 400, 'Maaf Nama Klub atau Kota Klub sudah tersedia');

        let result = await Klub.create({nama_klub, kota_klub},{t});
        await Point.create({mKlubId: result.id},{t});
        await t.commit();
        res.status(201).json({msg: 'Klub berhasil ditambahkan', statusCode: 201, data: result});
    }catch(err){
        t.rollback();
        console.log(err);
        return CustomError(res, 500);
    }
};

export async function GetAllKlub(req, res){
    try{
        let result = await Klub.findAndCountAll({
            include: [{
                model: Point
            }]
        });
        res.status(200).json({msg: 'berhasil mengambil semua data Klub', statusCode: 200, data: result});
    }catch(err){
        console.log(err);
        return CustomError(res, 500);
    }
};

export async function GetAllKlubPagination(req, res){
    const page = req.query.page || 1;
    const size = req.query.size || 10;
    const skip = parseInt(parseInt(page) - 1) * parent(size);
    try{
        let result = await Klub.findAndCountAll({
            limit: parseInt(size),
            offset: skip,
            include: [{
                model: Point
            }]
        });
        res.status(200).json({msg: 'berhasil mengambil semua data Klub', statusCode: 200, data: result});
    }catch(err){
        console.log(err);
        return CustomError(res, 500);
    }
};

export async function GetKlubById(id){
    let klub = await Klub.findOne({
        where: {id: id},
        include: [{
            model: Point
        }]
    });
    if(!klub) throw Error('Klub Not Found');
    return klub;
};