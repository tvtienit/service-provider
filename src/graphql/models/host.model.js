import mongoose from 'mongoose';
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const hostSchema = new Schema({
    userId: {
        type: String,
    },
    phone: {
        type: String,
    }
}, { collection: 'host', timestamps: true });

hostSchema.index({ phone: 'text' });
const mHost = mongoose.model('host', hostSchema);

exports.Host = mHost;