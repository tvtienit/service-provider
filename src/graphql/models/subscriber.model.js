import mongoose from 'mongoose';
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const subSchema = new Schema({
    userId: { type: String },
    locationId: { type: String }
}, { collection: 'subscriber', timestamps: true });

const mSub = mongoose.model('subscriber', subSchema);

exports.Subscriber = mSub;