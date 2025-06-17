module.exports = (res,statusCode,errorMessage) => {
    res.status(statusCode).json({
        success:false,
        error:errorMessage
    });
};