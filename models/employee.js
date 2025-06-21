const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    timestamps:{
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    },
    collection: 'employees'
}
const employeeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    employeeId: {
        type: String,
		required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    degisnation: {
        type: String,
        required: true,
    },
    wageAmount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    workingHour: {
        type: Number,
        required: true,
    },
    travelAllowance: {
        type: Number,
        required: true,
    },
    recessTime: {
        type: Number,
        required: true,
    },
    isDeleted: {
        default: false,
        type: Boolean
    },
}, options);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = {
    model: Employee,
    insertOne: async(payload) => {
        try {
            return await Employee.create(payload);
        } catch (error) {
            throw error;
        }
    }, 
    findAll: async(query, projection) => {
        try {
            return await Employee.find(query, projection)
        } catch (error) {
            throw error;
        }
    },
    findOne: async(query, projection) => {
        try {
            return await Employee.findOne(query, projection);
        } catch (error) {
            throw error;
        }
    }, 
    deleteOne: async(id) => {
        try {
            return await Employee.updateOne({_id: ObjectId(id)}, {$set:{isDeleted: true}});
        } catch (error) {
            throw error;
        }
    }, 
    updateOne: async(id, payload) => {
        try {
            return await Employee.updateOne({_id: ObjectId(id)}, {$set:payload});
        } catch (error) {
            throw error;
        }
    }, 
    aggregate: async(pipeline) => {
        try {
            return await Employee.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }
};