import mongoose, { SchemaType } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;
var Float = require('mongoose-float').loadType(mongoose, 4);

const locationSchema = (name, optionFields) => new Schema({
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
    is_inspected: {
        type: Boolean
    },
    ...optionFields
}, { collection: name, timestamps: true });

const location = locationSchema('location', { hostId: { type: String } });
location.index({ title: 'text', description: 'text', city: 'text', address: 'text' });
location.plugin(mongoosePaginate);

const mLocation = mongoose.model('location', location);
const locDraft = mongoose.model('location_draft', locationSchema('location_draft', { realId: { type: String } }));

exports.Location = mLocation;
exports.LocationDraft = locDraft;