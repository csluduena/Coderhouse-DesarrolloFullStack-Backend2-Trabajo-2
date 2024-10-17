import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]  // Relación con los productos
});

export const Category = mongoose.model('Category', CategorySchema);