const jwt = require('jsonwebtoken');

exports.isAccessable=()=>{
    return (req, res, next)=>{
        try {
            const token = req.header('authorization');
            if(!token) {
                return res.status(400).json({status: 400, message: "No token found.", data: ""})
            }
            const data = jwt.verify(token, process.env.JWT_KEY);
            if(data && data.isAdmin){
                req.user = data.id;
                return next();
            }
            return res.status(401).json({status: 401, message: "Not authorized.", data: ""}) 
        } catch (error) {
            console.log(error);
            return res.status(400).json({status: 400, message: "Enter a valid token", data: ""})
        }
    }
}
