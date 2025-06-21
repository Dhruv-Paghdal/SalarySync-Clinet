const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    timestamps:{
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    },
    collection: 'loans'
}
const loanSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        require: true
    },
    isDeleted: {
        default: false,
        type: Boolean
    }
}, options);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = {
    model: Loan,
    insertOne: async(payload) => {
        try {
            return await Loan.create(payload);
        } catch (error) {
            throw error;
        }
    }, 
    findAll: async(query, projection) => {
        try {
            return await Loan.find(query, projection)
        } catch (error) {
            throw error;
        }
    },
    findOne: async(query, projection) => {
        try {
            return await Loan.findOne(query, projection);
        } catch (error) {
            throw error;
        }
    }, 
    deleteOne: async(id) => {
        try {
            return await Loan.updateOne({_id: ObjectId(id)}, {$set:{isDeleted: true}});
        } catch (error) {
            throw error;
        }
    }, 
    updateOne: async(id, payload) => {
        try {
            return await Loan.updateOne({_id: ObjectId(id)}, {$set:payload});
        } catch (error) {
            throw error;
        }
    }, 
    aggregate: async(pipeline) => {
        try {
            return await Loan.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }
};