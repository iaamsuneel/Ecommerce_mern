import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: { type: String, required: true, unique: true },
        mobileNo: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);
const User = mongoose.model("user", userSchema);
export default User;
