const XLSX = require('xlsx');
const handlebars = require("handlebars");
const puppeteer = require('puppeteer');
const Company = require('../models/company');
const Employee = require('../models/employee');
const AdvanceSalary = require('../models/advanceSalary');
const Loan = require('../models/loans');
const Salary = require('../models/salary');
const ObjectId = require('mongoose').Types.ObjectId;
const { validationResult } = require('express-validator');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const templateFile =  path.join(__dirname, '..', 'templates', 'index.html');

exports.list = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array(), data: "" });
    }
    const company = req.user;
    if(!company) {
      return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
    }
    const companyQuery = {
      isDeleted: false,
      _id: company
    }
    const companyDetails = await Company.findOne(companyQuery);
    if (!companyDetails) {
        return res.status(404).json({ status: 404, message: "No company found", data: "" })
    }
    if (!companyDetails.isActive) {
      return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
    }
    if (!companyDetails.workingYear) {
        return res.status(400).json({ status: 400, message: "Working-year not found. Please set working year", data: "" })
    } 
    const conditions = {
      isDeleted: false,
      company: ObjectId(company),
      workingYear: req.query.working_year ? req.query.working_year : companyDetails.workingYear
    }
    const countPipeline = [{
      $group: {
        _id: null,
        totalCount: {
          $sum: {
            $cond: [{
              $and: [{
                $eq: ["$isDeleted", false]
              }, {
                $eq: ["$company", ObjectId(company)]
              }, {
                $eq: ["$workingYear", conditions.workingYear]
              }]
            }, 1, 0]
          }
        }
      }
    }];
    const totalCount = await Salary.aggregate(countPipeline);
    if(totalCount.length == 0 || totalCount[0].totalCount == 0) {
        return res.status(200).json({status:200, message: "No salary list", data: []})   
    }
    const row = req.query.row > 0 ? parseInt(req.query.row) : 5;
    const page = req.query.page > 0 ? parseInt(req.query.page) : 1;
    const offset = (page-1)*row;
    const totalPage = Math.ceil(totalCount[0].totalCount/row);
    const pipeline = [{
      $match: conditions
    }, {
      $skip: offset
    }, {
      $limit: row
    }, {
      $lookup: {
        from: "employees",
        localField: "salaryDetails.employeeId",
        foreignField: "_id",
        as: "employeeDetails",
      }
    }];
    const salaryList = await Salary.aggregate(pipeline);
    if(!salaryList.length) {
        return res.status(200).json({status:200, message: "No salary list", data: []})   
    }
    return res.status(200).json({status:200, message: "Salary list", data: [{page: page.toString()+" of "+ totalPage.toString(), list:salaryList}]});
  } catch (error) {
    return res.status(400).json({status:400, message: "Error while getting salary list", data: ""}); 
  }
}

exports.calculate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, message: errors.array(), data: "" });
    }
    const companyId = req.user;
    if(!companyId) {
      return res.status(400).json({status:400, message: "CompanyId not found in header", data: ""}) 
    }
    if(companyId !== req.params.companyId) {
      return res.status(400).json({status:400, message: "CompanyId is incorrect", data: ""}) 
    }
    const companyQuery = {
        isDeleted: false,
        _id: companyId
    }
    const companyDetails = await Company.findOne(companyQuery);
    if (!companyDetails) {
      return res.status(404).json({ status: 404, message: "No company found", data: "" })
    }
    if (!companyDetails.isActive) {
      return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
    }
    if (!companyDetails.workingYear) {
      return res.status(400).json({ status: 400, message: "Working-year not found. Please set working year", data: "" })
    }
    const employeeQuery = {
        isDeleted: false,
        company: ObjectId(companyId)
    }
    const employeeList = await Employee.findAll(employeeQuery, "_id employeeId wageAmount workingHour travelAllowance recessTime")
    if (!employeeList) {
      return res.status(404).json({ status: 404, message: "No employee found", data: "" });
    }
    const startDate = new Date(moment.utc(req.body.year+"-"+req.body.month, "YYYY-MM").startOf('month').format("YYYY-MM-DD"));
    const endDate = new Date(moment.utc(req.body.year+"-"+req.body.month, "YYYY-MM").endOf('month').format("YYYY-MM-DD"));
    const advanceSalaryPipeline = [
      {
        $match: {
          isDeleted: false,
          company: ObjectId(companyId),
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
        }
      }
    ]
    const employeeAdvanceSalary = await AdvanceSalary.aggregate(advanceSalaryPipeline);
    const loanPipeline = [
      {
        $match: {
          isDeleted: false,
          company: ObjectId(companyId),
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
        }
      }
    ]
    const employeeLoan = await Loan.aggregate(loanPipeline);
    const headerMapping = {
        "EMPLOYEE_ID": 'emp_id',
        "DATE (MM-DD-YYYY)": 'date',
        "PUNCH_IN": 'in',
        "PUNCH_OUT": 'out',
        "RECESS": "recess"
    };
    const employeeData = [];
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheet_name_list = workbook.SheetNames;
    const sheet_number = 0;
    folder_name = sheet_name_list[sheet_number];
    const worksheet = workbook.Sheets[sheet_name_list[sheet_number]];
    const headers = {};
    for (const z in worksheet) {
        if (z[0] === '!') continue;
        let tt = 0;
        for (let i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        const col = z.substring(0, tt);
        const row = parseInt(z.substring(tt));
        const value = worksheet[z].w;
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }
        if (!employeeData[row]) employeeData[row] = {};
        employeeData[row][headerMapping[headers[col]]] = value;
    }
    employeeData.shift();
    employeeData.shift();
    const salaryArray = [];
    for (const employee of employeeList) {
      const advanceSalaryList = [];
      let employeeLoanAmount = 0;
      for (const advanceSalary of employeeAdvanceSalary) {
        if (employee._id.toString() == advanceSalary.employee.toString()) { 
          advanceSalaryList.push({date: moment.utc(advanceSalary.date).format("MM-DD-YYYY"), amount: parseFloat(advanceSalary.amount), _id: advanceSalary._id}) 
        }
      }
      for (const loan of employeeLoan) {
        if (employee._id.toString() == loan.employee.toString()) { 
          employeeLoanAmount += parseFloat(loan.amount)
        }
      }
      salaryArray.push({"employeeId": employee["employeeId"], "_id": employee["_id"],"fixedSalary": parseFloat(employee["wageAmount"]), "fixedWorkingHour": employee["workingHour"], "travelAllowance": employee["travelAllowance"], "recessTime":employee["recessTime"], "advanceSalaryList": advanceSalaryList, "loan": employeeLoanAmount,"leaveList": []})
    }
    for (const data of salaryArray) {
        for (const employee of employeeData) {
            let totalHour = 0;
            let totalFixedHourWorked = 0;
            let inCompleteHour = 0;
            let extraHour = 0;
            let workingDay = 0;
            if (employee["emp_id"] == data["employeeId"]) {
                if(employee.in && employee.out) {
                    const inTime = moment(employee.in, "hh:mm:ss a");
                    const outTime = moment(employee.out, "hh:mm:ss a");
                    totalHour = moment.duration(outTime.diff(inTime)).asHours();
                    if(totalHour >= data["fixedWorkingHour"]){
                      extraHour =  totalHour - (data["fixedWorkingHour"]);
                      totalFixedHourWorked = totalHour - extraHour;
                    }
                    else{
                      inCompleteHour = (data["fixedWorkingHour"]) - totalHour;
                      totalFixedHourWorked = totalHour;
                    }
                    if(employee?.recess > data["recessTime"]) {
                      const diff = employee?.recess - data["recessTime"];
                      extraHour = extraHour - moment.duration(diff, 'minutes').asHours();
                    }
                    workingDay = 1;
                    // -------------
                    // totalHour = moment.duration(outTime.diff(inTime)).asHours();
                    // extraHour = totalHour - (data["fixedWorkingHour"]);
                    // if(employee?.recess > data["recessTime"]) {
                    //   const diff = employee?.recess - data["recessTime"];
                    //   extraHour = extraHour - moment.duration(diff, 'minutes').asHours();
                    // }                   
                    // workingDay = 1;
                    // -------------

                    // if(extraHour < 0){
                    //  totalHour = totalHour + extraHour
                    // }
                    // if (totalHour >= (data["fixedWorkingHour"] + moment.duration(data["recessTime"], 'minutes').asHours())) {
                    //   workingDay = 1;
                    // }
                    // else {
                    //   inCompleteHour = totalHour;
                    // }
                    data["travelDays"] = data?.travelDays ? (data.travelDays + 1) : 1;
                    data["totalWorkingDays"] = data?.totalWorkingDays ? (data.totalWorkingDays + workingDay) : workingDay;
                    data["extraHour"] = parseFloat(data?.extraHour) ? parseFloat(data.extraHour) + parseFloat(extraHour) : parseFloat(extraHour);
                    data["totalFixedHourWorked"] = parseFloat(data?.totalFixedHourWorked) ? parseFloat(data.totalFixedHourWorked) + parseFloat(totalFixedHourWorked) : parseFloat(totalFixedHourWorked)
                    data["inCompleteHour"] = parseFloat(data?.inCompleteHour) ? parseFloat(data.inCompleteHour) + parseFloat(inCompleteHour) : parseFloat(inCompleteHour)
                }
                else{
                  const cond1 = companyDetails?.weekOffDay?.some(day => day.toLowerCase() === moment(employee.date, "MM-DD-YYYY").format("dddd").toLowerCase());
                  const cond2 = req.body?.holidays?.includes(moment(employee.date, "MM-DD-YYYY").format("MM-DD-YYYY"));
                  if(!cond1 && !cond2) {
                    data["leaveList"].push(moment(employee.date, "MM-DD-YYYY").format("MM-DD-YYYY"));
                  }
                }
            }
        }
        if(data["inCompleteHour"] > 0 && data["extraHour"] > data["inCompleteHour"]){
          data["extraHour"] = data["extraHour"] - data["inCompleteHour"];
          data["totalFixedHourWorked"] = data["totalFixedHourWorked"] + data["inCompleteHour"];
        }
        if(data["inCompleteHour"] > 0 && data["extraHour"] < data["inCompleteHour"]){
          data["extraHour"] = 0;
          data["inCompleteHour"] = data["extraHour"] + data["inCompleteHour"];
        }
        // if(data["extraHour"] && data["inCompleteHour"]) {
        //   let extra = data["inCompleteHour"];
        //   let fix = data["fixedWorkingHour"] + moment.duration(data["recessTime"], 'minutes').asHours();
        //   // FINDING THE NEAREST NUMBER FOR INCOMPLETE HOUR BASED ON FIXED WOKRING HOUR
        //   // extra = 15, fix = 8.5 ==> extra = 17
        //   extra = extra + fix/2;
        //   extra = extra - (extra%fix);
        //   // CONVERTING EXTRA INTO HOUR
        //   // extra = 17 ==> hour = 2
        //   extra = extra / fix;
        //   if (data["extraHour"] >= extra) {
        //     data["extraHour"] = data["extraHour"] - extra;
        //     data["inCompleteHour"] = data["inCompleteHour"] + extra;
        //   }
        // }
        // if (data["inCompleteHour"]) {
        //   let fix = data["fixedWorkingHour"] + moment.duration(data["recessTime"], 'minutes').asHours();
        //   data["totalWorkingDays"] = data["totalWorkingDays"] + Math.round(data["inCompleteHour"] / fix);
        // }
        // delete data["inCompleteHour"]
        data["extraHour"] >= 1 ? data["extraHourSalary"] = (data["extraHour"]) * (data["fixedSalary"] * (req.body?.over_time_pay_rate ? req.body?.over_time_pay_rate : 1 )): delete data["extraHour"];
        if (data["advanceSalaryList"]) {
          let total = 0;
          for (const advanceSalary of data["advanceSalaryList"]) {
            total += advanceSalary.amount
          }
          data["totalAdvanceSalary"] = total;
        }
        if(data["travelDays"] !== data["totalWorkingDays"]) {
          data["travelDays"] = data["totalWorkingDays"];
        }
        data["regularSalary"] = data["totalFixedHourWorked"] * data["fixedSalary"];
        data["travelFair"] = data["travelDays"] * data["travelAllowance"];
        data["finalSalary"] = (data["regularSalary"] + data["travelFair"] + (data?.extraHourSalary ? data["extraHourSalary"] : 0)) - (data["totalAdvanceSalary"] + data["loan"])
        delete data["fixedWorkingHour"]; 
        delete data["recessTime"]; 
        delete data["travelDays"];
    } 
    const salary = [];
    for (const data of salaryArray) {
      const obj = {
        employee: data.employeeId,
        employeeId: data._id,
        fixedSalary: data.fixedSalary,
        totalFixedHourWorked: data.totalFixedHourWorked,
        travelAllowance: data.travelAllowance,
        totalWorkingDays: data.totalWorkingDays,
        totalOverTimePeriod: data?.extraHour,
        OverTimeSalary: data?.extraHourSalary,
        totalAdvanceSalary: data?.totalAdvanceSalary,
        loan: data?.loan,
        totalTravelAllowance: data?.travelFair,
        finalSalary: data?.finalSalary,
        advanceList: data?.advanceSalaryList,
        absent: data?.leaveList,
      }
      salary.push(obj);
    }
    const payload = {
      company: companyId,
      workingYear: companyDetails.workingYear,
      month: req.body.month,
      year: req.body.year,
      salaryDetails:salary
    }
    const salaries = await Salary.insertOne(payload);
    if (!salaries) {
      return res.status(400).json({status:400, message: "Error while calculating employees salaries.", data: ""}) 
    }
    return res.status(200).json({ status: 200, message: "Employees salaries calculated successfully.", data: "" })
  } catch (error) {
    return res.status(400).json({status:400, message: "Error while calculating salary", data: ""}); 
  }
}

exports.report = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array(), data: "" });
    }
    const company = req.user;
    if (!company) {
      return res.status(400).json({ status: 400, message: "CompanyId not found in request", data: "" })
    }
    const companyQuery = {
      isDeleted: false,
      _id: company
    }
    const companyDetails = await Company.findOne(companyQuery);
    if (!companyDetails) {
      return res.status(404).json({ status: 404, message: "No company found", data: "" })
    }
    if (!companyDetails.isActive) {
      return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
    }
    const pipeline = [{
      $match: {
        isDeleted: false,
        _id: ObjectId(req.params.salaryID),
        company: ObjectId(company)
      }
    }, {
      $lookup: {
        from: "employees",
        let: {"employee": "$salaryDetails.employeeId"},
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                $in: ["$_id","$$employee"]
              }]
            }
          }
        }, {
          $project: {
            name:1,
            mobile: 1,
            employeeId: 1,
          }
        }],
        as: "employeeData" 
      }
    }];
    const salaryDetail = await Salary.aggregate(pipeline);
    if(!salaryDetail) {
      return res.status(200).json({ status: 200, message: "No salary detail found", data: ""});
    }
    const salaryData = [];
    for (const data of salaryDetail[0].salaryDetails) {
      const obj = {
        "EMPLOYEE_ID": data.employee,
        "NAME": "",
        "PER_HOUR_SALARY": parseFloat(data.fixedSalary),
        "BASIC_SALARY": (parseFloat(data.totalFixedHourWorked)*parseFloat(data.fixedSalary)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "OVER_TIME_PERIOD": data?.totalOverTimePeriod ? parseFloat(data.totalOverTimePeriod).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "OVER_TIME_SALARY": data?.OverTimeSalary ? parseFloat(data.OverTimeSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "ADVANCE_SALARY": data?.totalAdvanceSalary ? parseFloat(data.totalAdvanceSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "LOAN": data?.loan ? parseFloat(data.loan).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "TRAVEL_ALLOWANCE": data?.totalTravelAllowance ? parseFloat(data.totalTravelAllowance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "TRAVEL_ALLOWANCE_PER_DAY": data?.travelAllowance ? parseFloat(data.travelAllowance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        "FINAL_SALARY": parseFloat(data.finalSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "ABSENT": data?.absent ? data.absent.length : 0,
        "ADVANCE_SALARY_LIST": data?.advanceList ? data.advanceList : "", 
        "ABSENT_LIST_1": data?.absent ? data.absent.slice(0, Math.ceil(data.absent.length / 2)) : "",
        "ABSENT_LIST_2": data?.absent ? data.absent.slice(Math.ceil(data.absent.length / 2)) : ""
      }
      for (const employee of salaryDetail[0].employeeData) {
        if(data.employeeId.toString() == employee._id.toString()) {
          obj["NAME"] = (employee.name.split(" ").length > 1) ? (employee.name.split(" ")[0].charAt(0).toUpperCase() + employee.name.split(" ")[0].slice(1).toLowerCase() + " " + employee.name.split(" ")[1].charAt(0).toUpperCase() + employee.name.split(" ")[1].slice(1).toLowerCase()) : (employee.name.charAt(0).toUpperCase() + employee.name.slice(1).toLowerCase());
          break;
        }
      }
      salaryData.push(obj);
    }
    if(req.params.fileType == "PDF") {
      // const pdfData = {
      //   company: companyDetails.companyName.toUpperCase(),
      //   month: salaryDetail[0].month,
      //   year: salaryDetail[0].year,
      //   salaryData: salaryData
      // }
      // const puppeteerOptions = {
      //   headless: true,
      //   executablePath: null,
      //   args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      // };
      // const browser = await puppeteer.launch(puppeteerOptions);
      // const page = await browser.newPage();
      // const labelHtml = fs.readFileSync(templateFile, 'utf8');
      // handlebars.registerHelper('splitArray', function(array) {
      //   var result = [[], []];
      //   for (var i = 0; i < array.length; i++) {
      //     result[i % 2].push(array[i]);
      //   }
      //   return result;
      // });
      // const template = handlebars.compile(labelHtml);
      // const html = template(pdfData);
      // await page.setContent(html, {
      //     waitUntil: ['domcontentloaded', 'networkidle0', 'load']
      // })
      // const pdfBuffer = await page.pdf({
      //     format: 'A4',
      // });
      // res.setHeader("Content-Disposition", `attachment; filename=SALARY_REPORT ${salaryDetail[0].month}-${salaryDetail[0].year}.pdf`);
      // res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      // res.set("Content-Type", "application/pdf");
      // await browser.close();
      // // res.status(200).send(JSON.stringify({data: pdfBuffer.toString('base64')}));
      return res.status(200).json({status:200, message: "Salary report data generated", data: [{year: salaryDetail[0].year, month: salaryDetail[0].month, company: companyDetails.companyName.toUpperCase(), list: salaryData}]});
    }
    if (req.params.fileType == "XLSX") {
      for (const data of salaryData) {
        delete data.PER_DAY_SALARY;
        delete data.ABSENT_LIST_1;
        delete data.ABSENT_LIST_2;
        delete data.ADVANCE_SALARY_LIST;
        delete data.TRAVEL_ALLOWANCE_PER_DAY;
      }
      return res.status(200).json({status:200, message: "Salary report data generated", data: [{year: salaryDetail[0].year, month: salaryDetail[0].month, list: salaryData}]});
    }
  } catch (error) {
    console.log("catch error", error);
    return res.status(400).json({status:400, message: "Error while generating salary report", data: ""}); 
  }
}

exports.sheet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 400, message: errors.array(), data: "" });
    }
    const company = req.user;
    if (!company) {
      return res.status(400).json({ status: 400, message: "CompanyId not found in request", data: "" })
    }
    const companyQuery = {
      isDeleted: false,
      _id: company
    }
    const companyDetails = await Company.findOne(companyQuery);
    if (!companyDetails) {
      return res.status(404).json({ status: 404, message: "No company found", data: "" })
    }
    if (!companyDetails.isActive) {
      return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
    }
    const startDate = (moment.utc(req.body.year+"-"+req.body.month, "YYYY-MM").startOf('month').format("YYYY-MM-DD")).split("-")[2];
    const endDate = (moment.utc(req.body.year+"-"+req.body.month, "YYYY-MM").endOf('month').format("YYYY-MM-DD")).split("-")[2];
    const dateArray = [];
    for (let index = startDate; index <= endDate; index++) {
      dateArray.push(`${req.body.month}-${index}-${req.body.year}`)
    }
    const conditions = {
      isDeleted: false,
      company: ObjectId(company)
    }
    const employeeList = await Employee.aggregate([{$match: conditions}]);
    if(!employeeList.length) {
      return res.status(400).json({status:400, message: "No employee found", data: ""})   
    }
    const attendanceSheetArray = [];
    for (const date of dateArray) {
      for (const employee of employeeList) {
        const obj = {
          "EMPLOYEE_ID": employee.employeeId,
          "DATE (MM-DD-YYYY)": date,
          "PUNCH_IN": "",
          "PUNCH_OUT": "",
          "RECESS": "",
          "NAME": (employee.name.split(" ").length > 1) ? (employee.name.split(" ")[0].charAt(0).toUpperCase() + employee.name.split(" ")[0].slice(1).toLowerCase() + " " + employee.name.split(" ")[1].charAt(0).toUpperCase() + employee.name.split(" ")[1].slice(1).toLowerCase()) : (employee.name.charAt(0).toUpperCase() + employee.name.slice(1).toLowerCase())
        }
        attendanceSheetArray.push(obj)
      }
    }
    return res.status(200).json({status:200, message: "Attendance sheet data generated", data: [{year: req.body.year, month: req.body.month, list: attendanceSheetArray}]}); 
  } catch (error) {
    console.log(error);
    
    return res.status(400).json({status:400, message: "Error while generating attendance sheet", data: ""}); 
  }
}

exports.delete = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array(), data: "" });
    }
    const company = req.user;
    if (!company) {
      return res.status(400).json({ status: 400, message: "CompanyId not found in request", data: "" })
    }
    const companyQuery = {
      isDeleted: false,
      _id: company
    }
    const companyDetails = await Company.findOne(companyQuery);
    if (!companyDetails) {
      return res.status(404).json({ status: 404, message: "No company found", data: "" })
    }
    if (!companyDetails.isActive) {
      return res.status(400).json({ status: 400, message: "Subscription Ended. Please contact admin", data: "" })
    }
    const query = {
      _id : req.params.salaryID,
      isDeleted: false,
    }
    const salaryExist = await Salary.findOne(query);
    if(!salaryExist) {
        return res.status(404).json({status:404, message: "Salary data not found", data: ""}) 
    }
    const salaryUpdate = await Salary.deleteOne(req.params.salaryID);
    if(!salaryUpdate.modifiedCount) {
        return res.status(400).json({status:400, message: "Error while deleteing salary report", data: []}) 
    }
    return res.status(202).json({status:202, message: "Salary report deleted successfully", data: ""}) 
  } catch (error) {
    console.log(error);
    return res.status(400).json({status:400, message: "Error while deleteing salary report", data: ""}); 
  }
}
