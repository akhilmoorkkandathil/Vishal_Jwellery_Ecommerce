const constants = require('../constants')
//converting the error into json formate manual middleware
const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode?res.statusCode :500
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title:"Not Found", message:err.message,stackTrace:err.stack})
            break;
        case constants.NOT_FOUND:
            res.json({ title:"Validation Error", message:err.message,stackTrace:err.stack})
            break;            
        case constants.SERVER_ERROR:
            res.json({ title:"Server Error", message:err.message,stackTrace:err.stack})
            break;
        case constants.FORBIDDEN:
            res.json({ title:"Forbidden Error", message:err.message,stackTrace:err.stack})
            break;
        case constants.UNAUTHORIZED:
            res.json({ title:"Unauthorized Error", message:err.message,stackTrace:err.stack})
            break;


        default:
            console.log("No error. All good!");
            break;
    }
    
}
module.exports = errorHandler