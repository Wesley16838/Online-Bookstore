const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
      
        const token = req.cookies.token
      
        const decoded= jwt.verify(token, process.env.JWT_KEY)
        
        req.userData = decoded
        // res.redirect("/homepage");
        next()

    }catch(error){
        res.redirect("/user/login");
    }
}