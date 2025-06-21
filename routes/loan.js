const loanRouter = require('express').Router();
const loanService = require('../services/loanService');
const {checkSchema, param, query} = require('express-validator');
const validation = require('../helpers/validation');

loanRouter.get("/list",[
    query('page').notEmpty().withMessage('Page value is requried').isInt().withMessage('Value must be Integer'), 
    query('row').notEmpty().withMessage('Row value is requried').isInt().withMessage('Value must be Integer')
], loanService.list);
loanRouter.post("/add", checkSchema(validation.addLoan), loanService.add);
loanRouter.put("/:loanID/edit", param('loanID').notEmpty().withMessage("Loan ID is required"), loanService.edit);
loanRouter.put("/:loanID/delete", param('loanID').notEmpty().withMessage("Loan ID is required"), loanService.delete);

module.exports = loanRouter;