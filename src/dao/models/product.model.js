import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:
            true,
        min: 0
    },
    img: {
        type: String,
        required: true
    },
    model: { // Campo renombrado
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    brand: {
        type: String,
        required: true
    },
    category: { // Nuevo campo para la categoría
        type: String,
        required: true,
        enum: ['Electric Guitar', 'Bass', 'Drums', 'Keyboards']
    }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;