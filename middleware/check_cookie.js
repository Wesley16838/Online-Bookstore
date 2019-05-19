const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
      
        const token = req.cookies.token
      
        const decoded= jwt.verify(token, process.env.JWT_KEY)
        console.log("\nJWT verification result: " + JSON.stringify(decoded));
        if(!token){
            throw "Please log in or sign up first"
        }else{
            req.userData = decoded
            res.redirect("/homepage");
        }
        // next()
    }catch(error){
        next()
    }
}