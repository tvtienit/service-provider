import mongoose from 'mongoose';
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: String,
    },
    locationId: {
        type: String,
    },
    stars: {
        type: Number
    },
    content: {
        type: String
    }
}, { collection: 'review', timestamps: true });

const mReview = mongoose.model('review', reviewSchema);

exports.Review = mReview;