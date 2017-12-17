import mongoose from 'mongoose';
import { findIndexes } from '../../utils/schema';
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

const mCategory = mongoose.model('category', categorySchema);
categorySchema.index({ title: 'text', description: 'text' });
//console.log(findIndexes(mCategory));

exports.Category = mCategory;