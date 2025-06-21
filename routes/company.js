const companyRouter = require('express').Router();
const companyService = require('../services/companyService');

companyRouter.get("/profile", companyService.profile);
companyRouter.put("/profile/edit", companyService.edit)

module.exports = companyRouter;