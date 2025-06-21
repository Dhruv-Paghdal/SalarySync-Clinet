const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const options = {
    timestamps:{
        createdAt: "createdOn",
        updatedAt: "updatedOn"
    },
    collection: 'companies'
}
const companySchema = new mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    subscriptionHistory: {
        type: [String],
        default: []
    },
    mobile: {
        type: String
    },
    companyName: {
        type: String
    },
    companyCode: {
        type: String
    },
    workingYear: {
        type: String
    },
    weekOffDay: {
        type: [String],
        default: []
    },
    companyAddress: {
        addressLine: {
            type: String,
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: String,
        }
    },
    ownerDetail:[{
        name: {
            type: String,
        },
        mobile: {
            type: String,
        },
        email: {
            type: String,
        }
    }],
    workingYearList: [{
        type: String
    }],
    resetPin: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        default: false,
        type: Boolean
    }
}, options);

const Company = mongoose.model("Company", companySchema);

module.exports = {
    model: Company,
    insertOne: async(payload) => {
        try {
            return await Company.create(payload);
        } catch (error) {
            throw error;
        }
    }, 
    findAll: async(query, projection) => {
        try {
            return await Company.find(query, projection)
        } catch (error) {
            throw error;
        }
    },
    findOne: async(query, projection) => {
        try {
            return await Company.findOne(query, projection);
        } catch (error) {
            throw error;
        }
    }, 
    deleteOne: async(id) => {
        try {
            return await Company.updateOne({_id: ObjectId(id)}, {$set:{isDeleted: true}});
        } catch (error) {
            throw error;
        }
    }, 
    updateOne: async(id, payload) => {
        try {
            return await Company.updateOne({_id: ObjectId(id)}, {$set:payload});
        } catch (error) {
            throw error;
        }
    }, 
    aggregate: async(pipeline) => {
        try {
            return await Company.aggregate(pipeline);
        } catch (error) {
            throw error;
        }
    }
};