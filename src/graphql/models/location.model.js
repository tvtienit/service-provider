import mongoose, { SchemaType } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose, 4);

const locationSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    categoryId: {
        type: String
    },
    city: {
        type: String
    },
    img_source: {
        type: String
    },
    address: {
        type: String
    },
    lat: {
        type: Float
    },
    long: {
        type: Float
    },
    price: {
        type: Float
    },
    hostId: {
        type: String
    },
    is_inspected: {
        type: Boolean
    },
    subscriberIds: {
        type: [String]
    }
}, { collection: 'location', timestamps: true });

locationSchema.plugin(mongoosePaginate);

const mLocation = mongoose.model('location', locationSchema);

exports.Location = mLocation;