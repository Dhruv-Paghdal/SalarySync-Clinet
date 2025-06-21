const multer = require('multer');
const {check, checkSchema, query, param} = require('express-validator');
const validation = require('../helpers/validation')
const path = require('path');
const fs = require('fs');
const salaryRouter = require('express').Router();
const salaryService = require('../services/salaryService');
const sheetValidator = require('../middleware/sheetValidator');

// const storage = multer.diskStorage({
//     // destination: function (req, file, cb) {
//     //     if(!fs.existsSync(path.join(__dirname, "../public/uploads/company/"))){
//     //         fs.mkdirSync(path.join(__dirname, "../public/uploads/company/"), { recursive: true });
//     //     }
//     //     if(!fs.existsSync(path.join(__dirname, `../public/uploads/company/${req.params.companyId}/`))){
//     //         fs.mkdirSync(path.join(__dirname, `../public/uploads/company/${req.params.companyId}/`), { recursive: true });
//     //     }
//     //     cb(null, path.join(__dirname, `../public/uploads/company/${req.params.companyId}/`));
//     // },
//     // filename: function (req, file, cb) {
//     //   const renamedFile = req.body.month + "-" + req.body.year + "_TimeSheet" + path.extname(file.originalname);
//     //   cb(null, renamedFile)
//     // }
//     destination: function (req, file, cb) {
//         const destinationPath = path.join(process.cwd(), 'public', 'uploads', 'company', req.params.companyId);
//         if (!fs.existsSync(destinationPath)) {
//             fs.mkdirSync(destinationPath, { recursive: true });
//             console.log(destinationPath);
//         }
//         cb(null, destinationPath);
//     },
//     filename: function (req, file, cb) {
//         const renamedFile = `${req.body.month}-${req.body.year}_TimeSheet${path.extname(file.originalname)}`;
//         cb(null, renamedFile);
//     }
// })

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});  

salaryRouter.get("/list", [
    query('page').notEmpty().withMessage('Page value is requried').isInt().withMessage('Value must be Integer'), 
    query('row').notEmpty().withMessage('Row value is requried').isInt().withMessage('Value must be Integer'),
], salaryService.list);
salaryRouter.post("/:companyId/calculate", upload.single('sheet'), sheetValidator, [checkSchema(validation.calculateSalary)], salaryService.calculate);
salaryRouter.get("/:salaryID/report/:fileType", [param('salaryID').notEmpty().withMessage("SalaryId is required"), param('fileType').notEmpty().withMessage("File type is required").isIn(["PDF", "XLSX"]).withMessage("Enter a valid file type")], salaryService.report);
salaryRouter.post("/sheet", checkSchema(validation.attendanceSheet), salaryService.sheet);
salaryRouter.put("/:salaryID/delete", [param('salaryID').notEmpty().withMessage("SalaryId is required")], salaryService.delete);

module.exports = salaryRouter;

