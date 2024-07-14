import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        rating: { type: Number, required: true },
       // imageUrl: String
    },
    { timestamps: true }
);
const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
