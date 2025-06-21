const employeeRouter = require('express').Router();
const employeeService = require("../services/employeeService");
const validation = require('../helpers/validation')
const {checkSchema, query, param} = require('express-validator');

employeeRouter.get("/list", [
    query('page').notEmpty().withMessage('Page value is requried').isInt().withMessage('Value must be Integer'), 
    query('row').notEmpty().withMessage('Row value is requried').isInt().withMessage('Value must be Integer'),
],employeeService.list);
employeeRouter.post("/add", checkSchema(validation.addEmployee), employeeService.add);
employeeRouter.get("/:employeeID/detail", param('employeeID').notEmpty().withMessage("EmployeeId is required"), employeeService.detail);
employeeRouter.put("/:employeeID/edit", param('employeeID').notEmpty().withMessage("EmployeeId is required"), employeeService.edit);
employeeRouter.put("/:employeeID/delete", param('employeeID').notEmpty().withMessage("EmployeeId is required"), employeeService.delete);
employeeRouter.put("/:employeeID/appraisal", [param('employeeID').notEmpty().withMessage("EmployeeId is required"), checkSchema(validation.employeeAppraisal)], employeeService.appraisal);
employeeRouter.post("/appraisal/all", checkSchema(validation.employeeAppraisal), employeeService.appraisalAll);

module.exports = employeeRouter;