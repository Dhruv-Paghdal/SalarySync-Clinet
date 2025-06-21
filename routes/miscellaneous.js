const miscellaneousRouter = require('express').Router();
const miscellaneousService = require("../services/miscellaneousService");


miscellaneousRouter.get("/workinYear/list", miscellaneousService.workingYearList);
miscellaneousRouter.get("/company/id", miscellaneousService.companyId);
miscellaneousRouter.get("/employee/list", miscellaneousService.searchEmployee);

module.exports = miscellaneousRouter;