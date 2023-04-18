const logger = (req,res,next) => {
    //console.log(req.ip + " Connected!");
    next();
}

module.exports = logger;