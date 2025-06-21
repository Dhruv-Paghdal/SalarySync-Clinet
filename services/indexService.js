const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const Company = require("../models/company");

const transporter = nodeMailer.createTransport({
    service: "Gmail",
    host: process.env.NODEMAILER_HOST,
    port: 465,
    secure: true, 
    auth: {
      user: process.env.NODEMAILER_USER, 
      pass: process.env.NODEMAILER_PASSWORD, 
    }
  });

exports.login = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const data = req.body;
        const companyExist = await Company.findOne({userName: data.username});
        if (!companyExist) {
            return res.status(401).json({status: 401, message: "Invalid credentials", data: ""})
        }
        const verfiyPassword = bcrypt.compareSync(data.password, companyExist.password);
        if(!verfiyPassword){
            return res.status(400).json({status: 400, message: "Invalid credentials", data: ""})
        }
        const jwtData = {
            "id": companyExist._id,
            "isAdmin": true
        }
        const token = jwt.sign(jwtData, process.env.JWT_KEY)
        if(!token){
            return res.status(400).json({status:400, message: "Error while login", data: ""}) 
        }
        return res.status(200).json({status: 200, message: "Login Successfull", data: token})
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while login", data: ""}) 
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        const data = req.body;
        const query = {};
        if(data.email.toString().trim()) {
            query["email"] = data.email
        }
        if(data.username.toString().trim()) {
            query["userName"] = data.username
        }
        const companyExist = await Company.findOne(query);
        if (!companyExist) {
            return res.status(401).json({status: 401, message: "Invalid username or email", data: ""})
        }
        const digits = '0123456789'; 
        let OTP = ''; 
        const len = digits.length;
        for (let i = 0; i < 6; i++) { 
            OTP += digits[Math.floor(Math.random() * len)]; 
        } 
        const payload = {
            resetPin: OTP
        }
        const resetPin = await Company.updateOne(companyExist._id, payload);
        const html = `<b>Hi ${companyExist.companyName ? companyExist.companyName : 'User'},</b> <br /><br /> <p>You've have asked us to reset your Payroll Password. Your reset pin is <b style="color: #0d6efd">${payload.resetPin}.</b></p><br /><p>Please use this pin to reset your password.</p>`
        try {
            await transporter.sendMail({
                from: `"Payroll Admin" <${process.env.NODEMAILER_USER}>`,
                to: `${companyExist.email}`, 
                subject: "Reset Password", 
                html: html,
              });
        } catch (error) {
            console.log(error);
            return res.status(400).json({status:400, message: error, data: ""})   
        }
        if(!resetPin) {
            return res.status(400).json({status:400, message: "Error while forget password", data: ""}) 
        }
        return res.status(200).json({status: 200, message: "Reset pin sent to your registered mail.", data: companyExist._id})
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while forget password", data: ""}) 
    }
}

exports.otpVerify = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const data = req.body;
        const companyExist = await Company.findOne({_id: data.id});
        if (!companyExist) {
            return res.status(401).json({status: 401, message: "Company not found", data: ""})
        }
        if( data.otp !== companyExist.resetPin ) {
            return res.status(400).json({status:400, message:"OTP verification failed. Enter correct OTP.", data:""});
        }
        const clientUpdate = await Company.model.updateOne({_id: data.id}, {$unset: {resetPin: 1}})
        return res.status(200).json({status:200, message: "OTP verified successfully.", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while OTP verify", data: ""}) 
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const data = req.body;
        const companyExist = await Company.findOne({_id: data.id});
        if (!companyExist) {
            return res.status(401).json({status: 401, message: "Company not found", data: ""})
        }
        const newPassword = bcrypt.hashSync(data.confirm_password, bcrypt.genSaltSync(10));
        const payload = {
            password: newPassword
        }
        const clientUpdate = await Company.model.updateOne({_id: data.id}, {$set: payload})
        if(!clientUpdate) {
            return res.status(400).json({status:400, message: "Error while password reset", data: ""}) 
        }
        return res.status(200).json({status:200, message: "Password reset successfull", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while password reset", data: ""}) 
    }
}