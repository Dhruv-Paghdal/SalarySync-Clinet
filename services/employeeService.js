const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Company = require('../models/company');
const Employee = require('../models/employee');

exports.list = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: company
          }
        const companyDetails = await Company.findOne(query);
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const conditions = {
            isDeleted: false,
            company: ObjectId(company)
        }    
        const countPipeline = [{
            $group: {
                _id: null,
                totalCount: {
                    $sum: {
                        $cond: [{
                            $and: [
                                {
                                  $eq: ["$isDeleted", false]
                                },
                                {
                                  $eq: ["$company", ObjectId(company)]
                                }
                            ],
                        }, 1, 0]
                    }
                }
            }
        }];
        if (req.query.search) {
            const json = req.query.search;
            if(json.name){
                conditions["name"] = {
                    "$regex": json.name,
                    "$options": "i"
                };
                countPipeline[0].$group.totalCount.$sum.$cond[0].$and.push({
                    $eq: [{
                        $regexMatch: {
                            input: `$name`,
                            regex: json.name,
                            options: "i"
                        }
                    }, true]
                });
            }
            if(json.mobile){
                conditions["mobile"] = {
                    "$regex": json.mobile,
                    "$options": "i"
                };
                countPipeline[0].$group.totalCount.$sum.$cond[0].$and.push({
                    $eq: [{
                        $regexMatch: {
                            input: `$mobile`,
                            regex: json.mobile,
                            options: "i"
                        }
                    }, true]
                });
            }
            if(json.email){
                conditions["email"] = {
                    "$regex": json.email,
                    "$options": "i"
                };
                countPipeline[0].$group.totalCount.$sum.$cond[0].$and.push({
                    $eq: [{
                        $regexMatch: {
                            input: `$email`,
                            regex: json.email,
                            options: "i"
                        }
                    }, true]
                });
            }
            if(json.employeeId){
                conditions["employeeId"] = {
                    "$regex": json.employeeId,
                    "$options": "i"
                };
                countPipeline[0].$group.totalCount.$sum.$cond[0].$and.push({
                    $eq: [{
                        $regexMatch: {
                            input: `$employeeId`,
                            regex: json.employeeId,
                            options: "i"
                        }
                    }, true]
                });
            }
        }
        const row = req.query.row > 0 ? parseInt(req.query.row) : 5;
        const page = req.query.page > 0 ? parseInt(req.query.page) : 1;
        const offset = (page-1)*row;
        const totalCount = await Employee.aggregate(countPipeline);
        if((totalCount.length == 0) || (totalCount[0].totalCount == 0)) {
            return res.status(200).json({status:200, message: "No employees list", data: []})   
        }
        const totalPage = Math.ceil(totalCount[0].totalCount/row);
        const pipeline = [{
            $match: conditions
        }, {
            $skip: offset,
        }, {
            $limit: row
        }];
        const employeeList = await Employee.aggregate(pipeline);
        if(!employeeList.length) {
            return res.status(200).json({status:200, message: "No employees list", data: []})   
        }
        return res.status(200).json({status:200, message: "Employee list", data: [{page: page.toString()+" of "+ totalPage.toString(), list:employeeList}]});
    } catch (error) {
        return res.status(400).json({status:400, message: "Error getting employee list", data: ""}) 
    }
}

exports.add = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: company
        }
        const companyExist = await Company.findOne(query, "companyCode");
        if(!companyExist) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        if(!companyExist.companyCode) {
            return res.status(404).json({status:404, message: "Company code not found. Set company code.", data: ""}) 
        }
        const employeeQuery = {
            company: company
        }
        const recentEmployee = await Employee.model.findOne(employeeQuery, null, {sort: {"createdOn": -1}});
        let employeeId;
        if(!recentEmployee){
            employeeId = companyExist.companyCode + "-" + "01"
        }
        else {
            let number = parseInt(recentEmployee.employeeId.slice(companyExist.companyCode.length + 1)) + 1;
            if(number < 10){
                number = "0" + number.toString()
            }
            employeeId = companyExist.companyCode + "-" + number.toString()
        };
        const payload = {
            name: req.body.name.trim(),
            mobile: req.body.mobile,
            email: req.body.email ? req.body.email : "",
            employeeId: employeeId,
            company: company,
            degisnation: req.body.degisnation,
            wageAmount: parseFloat(req.body.wage_amount),
            workingHour: parseInt(req.body.working_hour),
            recessTime: parseInt(req.body.recess_time),
            travelAllowance: parseInt(req.body.travel_allowance)
        }
        const employee = await Employee.insertOne(payload);
        if(!employee) {
            return res.status(400).json({status:400, message: "Error while adding employee", data: ""}) 
        }
        return res.status(201).json({status:201, message: "Employee added sucessfully", data: ""})
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while adding employee", data: ""}) 
    }
}

exports.edit = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: ObjectId(req.params.employeeID),
            company: ObjectId(company)
        }
        const employeeExist = await Employee.findOne(query);
        if(!employeeExist) {
            return res.status(404).json({status:404, message: "Employee not found", data: ""}) 
        }
        const payload = {};
        if(req.body.name) {
            payload["name"] = req.body.name.trim();
        }
        if(req.body.mobile) {
            payload["mobile"] = req.body.mobile;
        }
        if(req.body.email) {
            payload["email"] = req.body.email.trim();
        }
        if(req.body.degisnation) {
            payload["degisnation"] = req.body.degisnation;
        }
        if(req.body.wage_amount) {
            payload["wageAmount"] = parseFloat(req.body.wage_amount);
        }
        if(req.body.working_hour) {
            payload["workingHour"] = parseInt(req.body.working_hour);
        }
        if(req.body.recess_time) {
            payload["recessTime"] = parseInt(req.body.recess_time);
        }
        if(req.body.travel_allowance) {
            payload["travelAllowance"] = parseInt(req.body.travel_allowance);
        }
        const employeeUpdate = await Employee.updateOne(req.params.employeeID, payload);
        if(!employeeUpdate.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while updating employee", data: []}) 
        }
        return res.status(202).json({status:202, message: "Employee updated successfully", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while updating employee", data: ""}) 
    }
}

exports.detail = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: ObjectId(req.params.employeeID),
            company: ObjectId(company)
        }
        const employeeExist = await Employee.findOne(query);
        if(!employeeExist) {
            return res.status(404).json({status:404, message: "Employee not found", data: ""}) 
        }
        return res.status(200).json({status:200, message: "Employee details", data: employeeExist});

    } catch (error) {
        return res.status(400).json({status:400, message: "Error getting employee detail", data: ""}) 
    }
}

exports.delete = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: ObjectId(req.params.employeeID),
            company: ObjectId(company)
        }
        const employeeExist = await Employee.findOne(query);
        if(!employeeExist) {
            return res.status(404).json({status:404, message: "Employee not found", data: ""}) 
        }
        const payload = {
            isDeleted: true
        };
        const employeeDelete = await Employee.updateOne(req.params.employeeID, payload);
        if(!employeeDelete.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while deleteing employee", data: ""}) 
        }
        return res.status(202).json({status:202, message: "Employee deleted successfully", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while deleteing employee", data: ""}) 
    }
}

exports.appraisal = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const query = {
            isDeleted: false,
            _id: ObjectId(req.params.employeeID),
            company: ObjectId(company)
        }
        const employeeExist = await Employee.findOne(query);
        if(!employeeExist) {
            return res.status(404).json({status:404, message: "Employee not found", data: ""}) 
        } 
        const newSalary = (req.body.appraisal_type) === "%" ? parseFloat(employeeExist.wageAmount) + parseFloat((parseFloat(employeeExist.wageAmount) * parseFloat(req.body.appraisal_value)) / 100) : parseFloat(employeeExist.wageAmount) + parseFloat(req.body.appraisal_value);
        const payload = {
            wageAmount : newSalary
        }
        const employeeAppraisal = await Employee.updateOne(req.params.employeeID, payload);
        if(!employeeAppraisal.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while adding employee appraisal", data: ""}) 
        }
        return res.status(202).json({status:202, message: "Employee appraisal added", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while adding employee appraisal", data: ""}) 
    }
}

exports.appraisalAll = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:400, message:errors.array(), data:""});
        }
        const company = req.user;
        if(!company) {
            return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
        }
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const query = {
            isDeleted: false,
            company: ObjectId(company)
        }
        const employeeList = await Employee.findAll(query, "_id wageAmount");
        if(!employeeList.length) {
            return res.status(404).json({status:404, message: "Employees not found", data: ""}) 
        } 
        let newSalaryArray = [];
        switch (req.body.appraisal_type) {
            case "%":
                for (const employee of employeeList) {
                    const newSalary = parseFloat(employee.wageAmount) + parseFloat((parseFloat(employee.wageAmount) * parseFloat(req.body.appraisal_value)) / 100);
                    newSalaryArray.push({_id: employee._id, wageAmount: parseFloat(newSalary)})
                }
                break;
            
            case "RS":
                for (const employee of employeeList) {
                    const newSalary = parseFloat(employee.wageAmount) + parseFloat(req.body.appraisal_value)
                    newSalaryArray.push({_id: employee._id, wageAmount: parseFloat(newSalary)})
                }
                break;
        
            default:
                for (const employee of employeeList) {
                    const newSalary = parseFloat(employee.wageAmount) + parseFloat(req.body.appraisal_value)
                    newSalaryArray.push({_id: employee._id, wageAmount: parseFloat(newSalary)})
                }
                break;
        }
        const allEmployeeAppraisal = await Employee.model.updateMany(
            { _id: { $in: newSalaryArray.map(o => o._id) } },
            [
              {
                $set: {
                  wageAmount: {
                    $let: {
                      vars: {
                        obj: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: newSalaryArray,
                                as: "nsa",
                                cond: { $eq: ["$$nsa._id", "$_id"] },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        $convert: {
                          input: "$$obj.wageAmount",
                          to: "decimal",
                        },
                      },
                    },
                  },
                },
              },
            ],
            { runValidators: true, multi: true }
          );          
        if(!allEmployeeAppraisal.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while adding appraisal for all employee", data: ""}) 
        }
        return res.status(202).json({status:202, message: "All employee appraisal added", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while adding appraisal for all employee", data: ""}) 
    }
}
