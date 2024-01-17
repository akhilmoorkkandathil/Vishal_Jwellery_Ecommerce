const adisAuth=(req,res,next)=>{
    if(req.session.isadAuth)
    {
        next()
    }
    else{
        res.redirect("/admin")
    }
}

module.exports={
    adisAuth
}