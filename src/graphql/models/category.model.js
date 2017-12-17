import mongoose from 'mongoose';
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

exports.Category = mCategory;