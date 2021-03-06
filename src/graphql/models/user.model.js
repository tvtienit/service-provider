import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true
    },
    nickname: {
        type: String,
    },
    phone: {
        type: String
    },
    is_registered: {
        type: Boolean
    }
}, { collection: 'user', timestamps: true });

userSchema.plugin(mongoosePaginate);
userSchema.index({ username: 'text', password: 'text', email: 'text', nickname: 'text', phone: 'text' });
const mUser = mongoose.model('user', userSchema);

exports.User = mUser;