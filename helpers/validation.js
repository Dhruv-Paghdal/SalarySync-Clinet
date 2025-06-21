const moment = require("moment");

module.exports = {
    login: {
        username: {
            notEmpty: true,
            errorMessage: "Username cannot be empty",
        },
        password: {
            notEmpty: true,
            errorMessage: "Password cannot be empty",  
        }
    },
    resetPassword: {
        new_password: {
            notEmpty: true,
            errorMessage: "New Password cannot be empty", 
            isLength:{
                options: { min: 4},
                errorMessage: "Minimum 4 characters required"   
            },
        },
        confirm_password: {
            notEmpty: true,
            errorMessage: "Confirm Password cannot be empty",
            isLength:{
                options: { min: 4},
                errorMessage: "Minimum 4 characters required"   
            }, 
        }
    },
    otpVerify: {
        otp: {
            notEmpty: true,
            errorMessage: "OTP is required",
            isLength:{
                options: { min: 6, max: 6},
                errorMessage: "OTP must contain 6 digits"   
            },
        }
    },
    addEmployee: {
        name:{
            notEmpty: true,
            errorMessage: "Name cannot be empty",
            isLength:{
                options: { min: 3 },
                errorMessage: "Name must be greater then 3 character"   
            },
        },
        mobile: {
            notEmpty: true,
            errorMessage: "Mobile number cannot be empty",
            isLength:{
                options: { min: 10 , max : 10},
                errorMessage: "Enter a valid mobile number"   
            },
        },
        email: {
            optional: {
                checkFalsy: true,
            },
            isEmail: true,
            errorMessage: "Enter a valid email address",
        },
        degisnation: {
            notEmpty: true,
            errorMessage: "Degisnation cannot be empty",
        },
        wage_amount: {
            isFloat: {
                options: {
                    gt: 0
                },
                errorMessage: "Wage amount must be a positive number greater than 0."
            },
            customSanitizer: {
                options: (value) => parseFloat(value), 
            },
        },
        working_hour: {
            notEmpty: true,
            errorMessage: "Working hour cannot be empty",
        },
        travel_allowance: {
            notEmpty: true,
            errorMessage: "Travel allowance is requried"
        },
        recess_time: {
            notEmpty: true,
            errorMessage: "Recess time cannot be empty",
        }
    },
    employeeAppraisal: {
        appraisal_type: {
            notEmpty: true,
            errorMessage: "Appraisal type is required"
        },
        appraisal_value: {
            notEmpty: true,
            errorMessage: "Appraisal value is required",
        }
    },
    addAdvanceSalary: {
        employee: {
            notEmpty: true,
            errorMessage: "Employee is required",
        },
        amount: {
            notEmpty: true,
            errorMessage: "Advance salary amount is required",
            isFloat: {
                options: {
                    gt: 0
                },
                errorMessage: "Advance salary amount must be a positive number greater than 0."
            },
            customSanitizer: {
                options: (value) => parseFloat(value), 
            },
        },
        type: {
            notEmpty: true,
            errorMessage: "Advance salary type is required",
        },
        date: {
            notEmpty: true,
            errorMessage: "Advance salary date is required",
        }
    },
    addLoan: {
        employee: {
            notEmpty: true,
            errorMessage: "Employee is required",
        },
        amount: {
            notEmpty: true,
            errorMessage: "Loan amount is required",
            isFloat: {
                options: {
                    gt: 0
                },
                errorMessage: "Loan amount must be positive number and greater than 0."
            },
            customSanitizer: {
                options: (value) => parseFloat(value), 
            },
        },
        date: {
            notEmpty: true,
            errorMessage: "Loan date is required",
        }
    },
    calculateSalary: {
        month: {
            notEmpty: true,
            isInt: {
                options: {
                    gt: 0,
                    lt:13
                }
            },
            errorMessage: "Enter a valid month."
        },
        year: {
            notEmpty: true,
            isInt: {
                options: {
                    gt: 0,
                }
            },
            errorMessage: "Enter a valid year."
        },
        holidays: {
            optional: true,
            custom: {
                options: (value) => {
                    if (!value) return true;
                    
                    const dates = value.split(",").map(date => date.trim());
    
                    for (let date of dates) {
                        if (!moment.utc(date, "MM-DD-YYYY", true).isValid()) {
                            throw new Error(`Invalid date: ${date}. Use MM-DD-YYYY format.`);
                        }
                    }
    
                    return true;
                }
            },
            errorMessage: "Enter valid holidays in MM-DD-YYYY format, separated by commas."
        },
        over_time_pay_rate: {
            optional: true,
            isFloat: {
                options: {
                    gt: 0
                },
                errorMessage: "Over time pay rate must be positive number and greater than 0."
            },
            customSanitizer: {
                options: (value) => parseFloat(value), 
            },
        }
    },
    attendanceSheet: {
        month: {
            notEmpty: true,
            isInt: {
                options: {
                    gt: 0,
                    lt:13
                }
            },
            errorMessage: "Enter a valid month."
        },
        year: {
            notEmpty: true,
            isInt: {
                options: {
                    gt: 0,
                }
            },
            errorMessage: "Enter a valid year."
        }
    }
}