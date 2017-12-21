import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const hostSchema = new Schema({
    userId: {
        type: String
    },
    host_title: {
        type: String
    },
    phone: {
        type: String
    },
    head_office: {
        type: String
    }
}, { collection: 'host', timestamps: true });

hostSchema.plugin(mongoosePaginate);
hostSchema.index({ phone: 'text', host_title: 'text', head_office: 'text' });
const mHost = mongoose.model('host', hostSchema);

exports.Host = mHost;