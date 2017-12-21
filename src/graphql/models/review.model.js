import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
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

reviewSchema.plugin(mongoosePaginate);
const mReview = mongoose.model('review', reviewSchema);

exports.Review = mReview;