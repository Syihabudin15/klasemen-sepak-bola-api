import { DB, Klub, Op } from "../Entities/Klub.js";
import { Point } from '../Entities/Point.js';
import { CustomError } from '../Configs/CustomError.js';
import { SavePoint } from "./PointService.js";
import { TransaksiPoint } from "../Entities/TransaksiPoint.js";
import { DetailPertandingan } from "../Entities/DetailPertandingan.js";
import { Pertandingan } from "../Entities/Pertandingan.js";
import { Sequelize } from "sequelize";

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
        let point = await SavePoint(result.id);
        await t.commit();
        res.status(201).json({msg: 'Klub berhasil ditambahkan', statusCode: 201, data: result});
    }catch(err){
        t.rollback();
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
    if(!klub) throw Error(`Klub dengan id ${id} tidak ditemukan`);
    return klub;
};

export async function GetKlasemen(req, res){
    try{
        const result = await Klub.findAll({
            include: [{
                model: Point,
                include: [{
                    model: TransaksiPoint,
                    include: [{
                        model: DetailPertandingan,
                    }]
                }]
            }]
        });
        let klasemen = result.map(e => {
            let data = [];
            let gm = 0;
            let gk = 0;
            let menang = e.m_point.m_transaksi_points.filter(e => {
                gm+= e.status == 'MENANG' ? e.m_detail_pertandingan.skor : 0;
                return e.status == 'MENANG'
            });
            let kalah = e.m_point.m_transaksi_points.filter(e => {
                gk += e.status == 'KALAH' ? e.m_detail_pertandingan.skor : 0;
                return e.status == 'KALAH'
            });
            let seri = e.m_point.m_transaksi_points.filter(e => e.status == 'SERI');

            return {
                id: e.id,
                nama_klub: e.nama_klub,
                kota_klub: e.kota_klub,
                point: e.m_point.point,
                ma: e.m_point.m_transaksi_points.length,
                me: menang.length,
                s: seri.length,
                k: kalah.length,
                gm,
                gk
            };
        });
        klasemen.sort((a,b) => {
            return b.point - a.point
        });

        res.status(200).json({msg: 'berhasil ambil data Klasemen', statusCode: 200, data: klasemen});
    }catch(err){
        console.log(err);
        return CustomError(res, 500);
    }
};