
const HttpError = require("../errors/HttpError");

function ErrorHandler(error, req, res, next){
    if(error instanceof HttpError){
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        })
    }

    if (process.env.NODE_ENV === "development"){
        if(error instanceof Error){
            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });

}

module.exports = ErrorHandler;