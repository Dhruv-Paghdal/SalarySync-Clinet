const Company = require("../models/company");
const Employee = require("../models/employee");
const ObjectId = require('mongoose').Types.ObjectId;

exports.workingYearList = async(req, res) => {
    try {
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const workinYearList = await Company.findOne({isDeleted: false, _id: company}, "workingYearList");
        if(!workinYearList) {
            return res.status(404).json({status:404, message: "No working year list found", data: ""}) 
        }
        return res.status(200).json({status:200, message: "Working year list successfully", data: workinYearList.workingYearList.reverse()})
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while getting working year list", data: ""}) 
    }
}

exports.companyId = async(req, res) => {
    try {
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyFound = await Company.findOne({isDeleted: false, _id: company}, "_id workingYear");
        if(!companyFound) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        return res.status(200).json({status:200, message: "CompanyId successfully", data: companyFound})
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while getting companyId", data: ""}) 
    }
}

exports.searchEmployee = async(req, res) => {
    try {
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyFound = await Company.findOne({isDeleted: false, _id: company}, "_id");
        if(!companyFound) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const pipeline = [{
            $match: {
                isDeleted: false,
                company: ObjectId(company)
            }
        }, {
            $project: {
                name: 1,
                employeeId: 1
            }
        }]
        if(req.query.name){
            pipeline[0].$match["name"] = {
                "$regex": req.query.name,
                "$options": "i"
            }
        }
        const employeeList = await Employee.aggregate(pipeline);
        if(!employeeList.length) {
            return res.status(200).json({status:200, message: "No employees list", data: []})   
        }
        return res.status(200).json({status:200, message: "Employee list", data: employeeList});
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while getting employee list", data: ""}) 
    }
}