const { validationResult } = require('express-validator');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const AdvanceSalary = require('../models/advanceSalary');
const Employee = require('../models/employee');
const Company = require('../models/company');

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
        const companyDetails = await Company.findOne({isDeleted: false, _id: company});
        if(!companyDetails) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        const searchJSON = req.query.search;
        const startDate = searchJSON?.start ? new Date(searchJSON.start) : new Date(moment.utc().startOf('month').format("YYYY-MM-DD"));
        const endDate = searchJSON?.end ? new Date(searchJSON.end) : new Date(moment.utc().endOf('month').format("YYYY-MM-DD"));
        if(startDate > endDate){
            return res.status(400).json({status:400, message: "Invalid dates", data: ""}) 
        }
        const row = req.query.row > 0 ? parseInt(req.query.row) : 5;
        const page = req.query.page > 0 ? parseInt(req.query.page) : 1;
        const offset = (page-1)*row;
        const pipeline = [
            {
              $match: {
                isDeleted: false,
                company: ObjectId(company),
              },
            }
        ];
        const filter = {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: ["$date", startDate],
                  },
                  {
                    $lte: ["$date", endDate],
                  },
                ],
              },
            },
        }
        const lookup = {
            $lookup: {
                from: "employees",
                let: {
                    "employeeId": "$employee"
                },
                pipeline: [
                    {
                        $match: {
                          $expr: {
                              $and: [{
                                  $eq: ["$_id", "$$employeeId"]
                              }]
                          }
                        }
                    },
                    {
                        $project: {
                          "name": 1,
                          "mobile": 1,
                          "email": 1,
                          "employeeId": 1
                        }
                    }
                ], 
                as: "employeeDetail"
            }
        }
        const countPipeline = [{
            $lookup: {
                from: "employees",
                localField: "employee",
                foreignField: "_id",
                as: "employee"
            }
        }, {
            $addFields: {
                employeeData: {
                    $arrayElemAt: ["$employee", 0]
                }
            }
        }, {
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
                                },
                                {
                                  $gte: ["$date", startDate],
                                },
                                {
                                  $lte: ["$date", endDate],
                                },
                            ],
                        }, 1, 0]
                    }
                }
            }
        }];
        const searchFilter = {$match: {}};
        if (searchJSON?.name) {
            searchFilter["$match"]["employeeDetail.name"] = {
                "$regex": searchJSON.name,
                "$options": "i"
            }
            countPipeline[2].$group.totalCount.$sum.$cond[0].$and.push({
                $eq: [{
                    $regexMatch: {
                        input: "$employeeData.name",
                        regex: searchJSON.name,
                        options: "i"
                    }
                }, true]
            })
        }
        if (searchJSON?.email) {
            searchFilter["$match"]["employeeDetail.email"] = {
                "$regex": searchJSON.email,
                "$options": "i"
            }
            countPipeline[2].$group.totalCount.$sum.$cond[0].$and.push({
                $eq: [{
                    $regexMatch: {
                        input: "$employeeData.email",
                        regex: searchJSON.email,
                        options: "i"
                    }
                }, true]
            })
        }
        if (searchJSON?.mobile) {
            searchFilter["$match"]["employeeDetail.mobile"] = {
                "$regex": searchJSON.mobile,
                "$options": "i"
            }
            countPipeline[2].$group.totalCount.$sum.$cond[0].$and.push({
                $eq: [{
                    $regexMatch: {
                        input: "$employeeData.mobile",
                        regex: searchJSON.mobile,
                        options: "i"
                    }
                }, true]
            })
        }
        if (searchJSON?.employeeId) {
            searchFilter["$match"]["employeeDetail.employeeId"] = {
                "$regex": searchJSON.employeeId,
                "$options": "i"
            }
            countPipeline[2].$group.totalCount.$sum.$cond[0].$and.push({
                $eq: [{
                    $regexMatch: {
                        input: "$employeeData.employeeId",
                        regex: searchJSON.employeeId,
                        options: "i"
                    }
                }, true]
            })
        }
        const totalCount = await AdvanceSalary.aggregate(countPipeline);
        if((totalCount.length == 0) || (totalCount[0].totalCount == 0)) {
            return res.status(200).json({status:200, message: "No advance salary list", data: []})   
        }
        const totalPage = Math.ceil(totalCount[0].totalCount/row);
        pipeline.push(filter, lookup, searchFilter, {$skip: offset}, {$limit: row});
        const advanceSalaryList = await AdvanceSalary.aggregate(pipeline);
        if(!advanceSalaryList.length) {
            return res.status(200).json({status:200, message: "No advance salary list", data: []})   
        }
        return res.status(200).json({status:200, message: "Advance salary list successfully", data: [{page: page.toString()+" of "+ totalPage.toString(), list:advanceSalaryList}]}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while getting advance salary list", data: ""}) 
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
        const companyExist = await Company.findOne(query);
        if (!companyExist) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        if (!companyExist.isActive) {
            return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
        }
        const employeeQuery = {
            _id : req.body.employee,
            isDeleted: false,
            company: company
        }
        const employeeExist = await Employee.findOne(employeeQuery);
        if(!employeeExist) {
            return res.status(404).json({status:404, message: "Employee not found", data: ""}) 
        }
        const payload = {
            company: company,
            employee: req.body.employee,
            amount: parseFloat(req.body.amount),
            type: req.body.type,
            date: req.body.date,
        }
        const advanceSalary = await AdvanceSalary.insertOne(payload);
        if(!advanceSalary) {
            return res.status(400).json({status:400, message: "Error while adding advance salary", data: ""}) 
        }
        return res.status(200).json({status:200, message: "Employee advance salary addedd successfully", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while adding employee advance salary", data: ""}) 
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
        const companyQuery = {
            isDeleted: false,
            _id: company
        }
        const companyExist = await Company.findOne(companyQuery);
        if (!companyExist) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        if (!companyExist.isActive) {
            return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
        }
        const query = {
            _id : req.params.advanveSalaryID,
            isDeleted: false,
        }
        const advanceSalaryExist = await AdvanceSalary.findOne(query);
        if(!advanceSalaryExist) {
            return res.status(404).json({status:404, message: "Employee advance salary not found", data: ""}) 
        }
        const payload = {};
        if(req.body.amount) {
            payload["amount"] = parseFloat(req.body.amount);
        }
        if(req.body.type) {
            payload["type"] = req.body.type;
        }
        if(req.body.date) {
            payload["date"] = req.body.date;
        }
        const advanceSalaryUpdate = await AdvanceSalary.updateOne(req.params.advanveSalaryID, payload);
        if(!advanceSalaryUpdate.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while updating employee advance salary", data: []}) 
        }
        return res.status(202).json({status:202, message: "Employee advance salary updated successfully", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while updating employee advance salary", data: ""}) 
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
        const companyQuery = {
            isDeleted: false,
            _id: company
        }
        const companyExist = await Company.findOne(companyQuery);
        if (!companyExist) {
            return res.status(404).json({status:404, message: "No company found", data: ""}) 
        }
        if (!companyExist.isActive) {
            return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
        }
        const query = {
            _id : req.params.advanveSalaryID,
            isDeleted: false,
        }
        const advanceSalaryExist = await AdvanceSalary.findOne(query);
        if(!advanceSalaryExist) {
            return res.status(404).json({status:404, message: "Employee advance salary not found", data: ""}) 
        }
        const advanceSalaryUpdate = await AdvanceSalary.deleteOne(req.params.advanveSalaryID);
        if(!advanceSalaryUpdate.modifiedCount) {
            return res.status(400).json({status:400, message: "Error while deleteing employee advance salary", data: []}) 
        }
        return res.status(202).json({status:202, message: "Employee advance salary deleted successfully", data: ""}) 
    } catch (error) {
        return res.status(400).json({status:400, message: "Error while deleteing employee advance salary", data: ""}) 
    }
}