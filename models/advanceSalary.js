const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    timestamps:{
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    },
    collection: 'advance-salaries'
}
const advanceSalarySchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        require: true
    },
    type: {
        enum: ["CASH", "INTERACT", "OTHER"],
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    isDeleted: {
        default: false,
        type: Boolean
    }
}, options);

const AdvanceSalary = mongoose.model("AdvanceSalary", advanceSalarySchema);

module.exports = {
    model: AdvanceSalary,
    insertOne: async(payload) => {
        try {
            return await AdvanceSalary.create(payload);
        } catch (error) {
            throw error;
        }
    }, 
    findAll: async(query, projection) => {
        try {
            return await AdvanceSalary.find(query, projection)
        } catch (error) {
            throw error;
        }
    },
    findOne: async(query, projection) => {
        try {
            return await AdvanceSalary.findOne(query, projection);
        } catch (error) {
            throw error;
        }
    }, 
    deleteOne: async(id) => {
        try {
            return await AdvanceSalary.updateOne({_id: ObjectId(id)}, {$set:{isDeleted: true}});
        } catch (error) {
            throw error;
        }
    }, 
    updateOne: async(id, payload) => {
        try {
            return await AdvanceSalary.updateOne({_id: ObjectId(id)}, {$set:payload});
        } catch (error) {
            throw error;
        }
    }, 
    aggregate: async(pipeline) => {
        try {
            return await AdvanceSalary.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }
};