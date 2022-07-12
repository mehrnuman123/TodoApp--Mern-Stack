
const sendToken= (user, statusCode,res)=>{

    // create jwt token

    const token = user.getJwtToken();

    // options for cookie
    
    
        {/** 
        
            expires:new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60* 1000
            ),
            httpOnly:true,   // http can not be accessed
    
        */}


    options = new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000) 
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token,
        user
    })

}

module.exports =sendToken