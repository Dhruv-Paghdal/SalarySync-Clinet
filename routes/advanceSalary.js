const advanceSalaryRouter = require('express').Router();
const advanceSalaryService = require('../services/advanceSalaryService');
const {checkSchema, param, query} = require('express-validator');
const validation = require('../helpers/validation');

advanceSalaryRouter.get("/list",[
    query('page').notEmpty().withMessage('Page value is requried').isInt().withMessage('Value must be Integer'), 
    query('row').notEmpty().withMessage('Row value is requried').isInt().withMessage('Value must be Integer')
], advanceSalaryService.list);
advanceSalaryRouter.post("/add", checkSchema(validation.addAdvanceSalary), advanceSalaryService.add);
advanceSalaryRouter.put("/:advanveSalaryID/edit", param('advanveSalaryID').notEmpty().withMessage("Advance salary ID is required"), advanceSalaryService.edit);
advanceSalaryRouter.put("/:advanveSalaryID/delete", param('advanveSalaryID').notEmpty().withMessage("Advance salary ID is required"), advanceSalaryService.delete);

module.exports = advanceSalaryRouter;