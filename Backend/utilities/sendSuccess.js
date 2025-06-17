module.exports = (res,statusCode,data,message=' ')=>{
    res.status(statusCode).json({
        success:true,
        message,
        data
    });
}