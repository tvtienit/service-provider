import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    }
}, { collection: 'category', timestamps: true });

categorySchema.plugin(mongoosePaginate);
categorySchema.index({ title: 'text', description: 'text' });
const mCategory = mongoose.model('category', categorySchema);

exports.Category = mCategory;