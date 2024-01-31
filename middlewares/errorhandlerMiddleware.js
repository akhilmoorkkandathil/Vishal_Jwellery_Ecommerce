const constants = require('../constants')
//converting the error into json formate manual middleware
const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode?res.statusCode :500
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            if(req.session.isAuth){
                res.render('./user/error',{statusCode:statusCode})
            }else if (req.session.isadAuth){
                res.render('./admin/error',{statusCode:statusCode})
            }else{

            }
            
            break;
        case constants.NOT_FOUND:
            if(req.session.isAuth){
                res.render('./user/error',{statusCode:statusCode})
            }else if (req.session.isadAuth){
                res.render('./admin/error',{statusCode:statusCode})
            }else{
                
            }
            break;            
        case constants.SERVER_ERROR:
            if(req.session.isAuth){
                res.render('./user/error',{statusCode:statusCode})
            }else if (req.session.isadAuth){
                res.render('./admin/error',{statusCode:statusCode})
            }else{
                
            }
            break;
        case constants.FORBIDDEN:
            if(req.session.isAuth){
                res.render('./user/error',{statusCode:statusCode})
            }else if (req.session.isadAuth){
                res.render('./admin/error',{statusCode:statusCode})
            }else{
                
            }
            break;
        case constants.UNAUTHORIZED:
            if(req.session.isAuth){
                res.render('./user/error',{statusCode:statusCode})
            }else if (req.session.isadAuth){
                res.render('./admin/error',{statusCode:statusCode})
            }else{
                
            }
            break;


        default:
            console.log("No error. All good!");
            break;
    }
    
}
module.exports = errorHandler

