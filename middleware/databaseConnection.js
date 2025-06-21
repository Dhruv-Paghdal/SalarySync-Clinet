const mongoose  = require('mongoose');
let isConnected;

exports.connectDB = () => {
    return async(req, res, next)=>{
        if(isConnected){
            return next();
        }
        else{
            try {
                await mongoose.connect(process.env.DB_URL, {
                  dbName: "payroll-client",
                  useNewUrlParser: true,
                  useUnifiedTopology: true
                });
                console.log("Bingo, DB connected successfully!!!!");
                isConnected = true;
                return next();
            } catch (error) {
                console.log("Opps, Error while connecting with DB!!!!");
                return res.status(400).json({ status: 400, message: "Error while connecting with DB", data: "" });
            }
        }
    }
}

