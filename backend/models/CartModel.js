import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
