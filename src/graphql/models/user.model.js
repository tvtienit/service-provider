import mongoose from 'mongoose';
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

const mUser = mongoose.model('user', userSchema);

exports.User = mUser;