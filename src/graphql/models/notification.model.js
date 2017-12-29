import mongoose from 'mongoose';
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const notifSchema = new Schema({
    message: { type: String },
    status: { type: Boolean },
    subId: { type: String }
}, { collection: 'notification', timestamps: true });

const mNotif = mongoose.model('notification', notifSchema);

exports.Notification = mNotif;