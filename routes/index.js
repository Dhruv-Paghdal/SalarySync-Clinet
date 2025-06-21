const indexRouter = require('express').Router();
const indexService = require('../services/indexService');
const validation = require("../helpers/validation")
const { checkSchema, check } = require('express-validator');

indexRouter.post("/login", checkSchema(validation.login), indexService.login);
indexRouter.post("/password/forgot", indexService.forgotPassword);
indexRouter.post("/password/otp/verify", checkSchema(validation.otpVerify), indexService.otpVerify);
indexRouter.post("/password/reset", [checkSchema(validation.resetPassword), check('confirm_password').custom((value, { req }) => {
    if( value !== req.body.new_password) {
        throw new Error('Password and Confirm password does not match')
    }else{
        return true;
    }
})], indexService.resetPassword);

module.exports = indexRouter;
