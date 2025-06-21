const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    timestamps:{
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    },
    collection: 'salaries'
}
const salarySchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    workingYear: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    salaryDetails: [{
        employee: {
            type: String,
            required: true,
        },
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        fixedSalary: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        travelAllowance: {
            type: Number,
        },
        totalWorkingDays: {
            type: Number,
            required: true,
        },
        totalFixedHourWorked: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },
        totalOverTimePeriod: {
            type: mongoose.Schema.Types.Decimal128,
        },
        OverTimeSalary: {
            type: mongoose.Schema.Types.Decimal128,
        },
        totalAdvanceSalary: {
            type: mongoose.Schema.Types.Decimal128,
        },
        loan: {
            type: mongoose.Schema.Types.Decimal128,
        }, 
        totalTravelAllowance: {
            type: Number,
        },
        finalSalary: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        advanceList: [{
            date: {
                type: String
            },
            amount: {
                type: mongoose.Schema.Types.Decimal128
            }
        }],
        absent: {
            type: [String]
        }
    }],
    isDeleted: {
        default: false,
        type: Boolean
    },
}, options);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = {
    model: Salary,
    insertOne: async(payload) => {
        try {
            return await Salary.create(payload);
        } catch (error) {
            throw error;
        }
    }, 
    findAll: async(query, projection) => {
        try {
            return await Salary.find(query, projection)
        } catch (error) {
            throw error;
        }
    },
    findOne: async(query, projection) => {
        try {
            return await Salary.findOne(query, projection);
        } catch (error) {
            throw error;
        }
    }, 
    deleteOne: async(id) => {
        try {
            return await Salary.updateOne({_id: ObjectId(id)}, {$set:{isDeleted: true}});
        } catch (error) {
            throw error;
        }
    }, 
    updateOne: async(id, payload) => {
        try {
            return await Salary.updateOne({_id: ObjectId(id)}, {$set:payload});
        } catch (error) {
            throw error;
        }
    }, 
    aggregate: async(pipeline) => {
        try {
            return await Salary.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }
};