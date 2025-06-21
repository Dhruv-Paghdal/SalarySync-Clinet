require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const databaseMiddleware = require('./middleware/databaseConnection');
const indexRoutes = require('./routes/index');
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
const salaryRoutes = require('./routes/salary');
const advanceSalaryRoutes = require('./routes/advanceSalary');
const loanRoutes = require('./routes/loan');
const miscellaneousRoutes = require('./routes/miscellaneous');
const authMiddleware = require('./middleware/userType');
const app = express();
const APP_PORT = process.env.APP_PORT;

app.use(databaseMiddleware.connectDB());

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
 }));
app.use(bodyParser.json());

app.use(`/index`, indexRoutes);
app.use(authMiddleware.isAccessable());
app.use(`/company`, companyRoutes);
app.use(`/employee`, employeeRoutes);
app.use(`/advance-salary`, advanceSalaryRoutes);
app.use(`/loan`, loanRoutes);
app.use(`/salary`, salaryRoutes);
app.use(`/misc`, miscellaneousRoutes);

app.listen(APP_PORT, ()=>{
    console.log(`App listing on http://localhost:${APP_PORT}`)
});