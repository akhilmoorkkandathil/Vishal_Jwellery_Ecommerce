const { VALIDATION_ERROR, UNAUTHORIZED_ERROR, FORBIDDEN, NOT_FOUND, SERVER_ERROR } = require('../constants');
//converting the error into json formate manual middleware
const errorHandler = (err,req,res ,next)=>{
    const statusCode = err.status || 500 ;
    switch (statusCode) {
        case SERVER_ERROR:
        case VALIDATION_ERROR:
        case UNAUTHORIZED_ERROR:
        case FORBIDDEN:
        case NOT_FOUND:
            if (req.session.isadAuth){
                res.render('./admin/errorPage',{statusCode:statusCode,Single:true})
            }else{
                res.render('./user/errorPage',{statusCode:statusCode,Single:true})
            }
            break;
            
             default:
            console.log("No error. All good!");
            break;
    }
    
}
module.exports = errorHandler

