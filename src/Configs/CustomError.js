export async function CustomError(res, status, msg){
    switch(status){
        case 500:
            return res.status(500).json({msg: 'Server Error', statusCode: 500});
        default:
            return res.status(status).json({msg: msg, statusCode: status});
    }
};