const path = require('path');
const validateSheetFormat = (req, res, next) => {
    const validFormat = [".xlsx", ".xls", ".xlsm", ".xlsb", ".csv"];
    if (!req.file || validFormat.indexOf(path.extname(req.file.originalname).toLocaleLowerCase()) < 0) {
        return res.status(400).json({ status: 400, message: "Please upload your file in xlsx, xls, xlsm, xlsb or csv format", data: "" });
    }
    next();
};

module.exports = validateSheetFormat;