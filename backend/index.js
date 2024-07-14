import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
const password = "Sun@8898";
const encodedPassword = encodeURIComponent(password);
const MONGO_URI = `mongodb+srv://iaamsuneel:${encodedPassword}@cluster0.lhqhzep.mongodb.net/task_db`;
// Connect to MongoDB Atlas
//connectDB();
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB Atlas::", error.message);
    });
// inital routes
app.get("/", (req, res) => {
    res.send("hello node");
});
// Multer configuration
/* const storage = multer.diskStorage({});
const upload = multer({ storage }); */
// Enable CORS middleware
app.use(cors());
// Middleware to parse incoming request bodies as JSON
app.use(express.json());
/* // Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}); */
// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1", productRoutes);
app.listen(port, () => {
    console.log(` Server is running :: ${port}`);
});
