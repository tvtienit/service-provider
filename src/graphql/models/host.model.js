import mongoose from 'mongoose';
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

hostSchema.index({ phone: 'text', host_title: 'text', head_office: 'text' });
const mHost = mongoose.model('host', hostSchema);

exports.Host = mHost;