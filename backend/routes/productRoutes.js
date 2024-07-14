import express from "express";
import {
    addProducts,
    addToCart,
    deleteProduct,
    deleteUserCart,
    getAllProduct,
    getUserCart,
    searchProduct,
    updateProduct,
    updateUserCart,
} from "../controllers/productController";
import { isCheckAuth } from "../middleware/userAuth";
const router = express.Router();
router.post("/create-product", addProducts);
router.put("/update-product/:id", updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.get("/get-all-product", getAllProduct);
router.post("/add-to-cart", isCheckAuth, addToCart);
router.get("/get-cart", isCheckAuth, getUserCart);
router.delete("/delete-cart/:id", isCheckAuth, deleteUserCart);
router.post("/update-cart", isCheckAuth, updateUserCart);
router.get("/search", searchProduct);
export default router;
