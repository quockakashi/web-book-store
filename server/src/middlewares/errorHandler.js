
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Middleware} next 
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    return next(error);
};


/**
 * 
 * @param {Error} err 
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // if the response was set the status code before it will be same the previous code, else the status code will 500 (Internal Error);
    let message = err.message;


    // mongo db error
    if(err.name === 'CastError') {
        statusCode = 404,
        message = `Resource not found - ${err.path}`;
    }

    if (err.code = 1100) {
        message = `Duplicate ${Object.keys(err.keyValue)}`
    }

    return res.status(statusCode).json({
        message: message,
        stack: err.stack,
    })
}

module.exports = errorHandler;