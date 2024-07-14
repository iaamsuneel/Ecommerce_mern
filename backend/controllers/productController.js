import Cart from "../models/CartModel";
import ProductModel from "../models/ProductModel";
export const addProducts = async (req, res) => {
    try {
        const { title, price, quantity, rating, description } = req.body;
        if (!title || !price || !quantity || !rating || !description) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "All fields mandatory !",
            });
        }
        let newData = new ProductModel({
            title,
            price,
            quantity,
            rating,
            description,
        });
        await newData.save();
        res.status(201).json({
            status: 201,
            success: true,
            message: "Added Product Successfully",
            data: newData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            status: 500,
        });
    }
};
export const getAllProduct = async (req, res) => {
    try {
        const productList = await ProductModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            status: 200,
            message: "Products retrieved successfully",
            data: productList,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { title, price, quantity, rating, description } = req.body;
        // Check if all fields are provided
        if (!title || !price || !quantity || !rating || !description) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are mandatory!",
            });
        }
        // Find the product by ID
        const getProduct = await ProductModel.findById(id);
        // If product doesn't exist, return error
        if (!getProduct) {
            return res.status(404).json({
                success: false,
                message: `Cannot update product with id=${id}, because id not found`,
            });
        }
        // Update the product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { title, price, quantity, rating, description },
            { new: true } // Return the updated document
        );

        // Return success response with updated product data
        return res.status(200).json({
            status: 200,
            message: "Product updated successfully",
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        // Handle any internal server errors
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            success: false,
        });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the product by ID and check if it exists
        const getProduct = await ProductModel.findByIdAndDelete(id);
        // If product doesn't exist, return error
        if (!getProduct) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Product not found",
            });
        }
        // Return success response if product is deleted successfully
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Product deleted successfully",
        });
    } catch (error) {
        // Handle any internal server errors
        res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error",
        });
    }
};
export const searchProduct = async (req, res) => {
    try {
        const { title } = req.query;
        // console.log("title---->", title);
        if (!title) {
            return res
                .status(400)
                .json({ error: "Please provide a title for the search" });
        }
        // Perform search query
        const searchResult = await ProductModel.find({
            title: { $regex: title, $options: "i" },
        });
        // console.log("searchResult--->", searchResult);
        if (searchResult.length == 0) {
            return res.status(201).json({
                success: true,
                status: 201,
                message: "Search Prodcut not found",
                data: searchResult,
            });
        }
        res.status(200).json({
            success: true,
            status: 200,
            message: "Search Prodcut retrieved successfully",
            data: searchResult,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            success: false,
        });
    }
};
export const addToCart = async (req, res) => {
    const { productId, quantity, totalPrice } = req.body;
    const userId = req.userId;
    try {
        // Check if a cart entry already exists for the given user and product
        let userCart = await Cart.findOne({ userId, productId }).populate({
            path: "productId",
            select: "title description price",
        });
        //  console.log("userCart-->", userCart);
        if (userCart) {
            // If cart entry exists, update quantity and totalPrice
            userCart.quantity += quantity;
            userCart.totalPrice += totalPrice;
        } else {
            // If cart entry does not exist, create a new one
            userCart = new Cart({
                productId,
                quantity,
                totalPrice,
                userId,
            });
        }
        // Save or update the cart document in the database
        await userCart.save();
        // Send response with updated or newly created cart details
        res.status(200).json({
            status: 200,
            success: true,
            message: "Product added to cart",
            data: userCart,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
};
export const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log("userId--->", userId);
        // Find the user's cart items by userId
        const userCartList = await Cart.find({ userId }).populate({
            path: "productId",
            select: "title description price",
        });
        if (!userCartList || userCartList.length === 0) {
            return res.status(200).json({
                status: 200,
                success: false,
                message: "User's cart is empty",
            });
        }
        // console.log("userCartList-->", userCartList);
        res.status(200).json({
            status: 200,
            success: true,
            message: "User's cart retrieved successfully",
            data: userCartList,
        });
    } catch (error) {
        console.error("Error fetching user's cart:", error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to retrieve user's cart",
            error: error.message,
        });
    }
};

export const updateUserCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;
        if (!productId || !quantity || !userId) {
            return res
                .status(400)
                .json({ error: "Please provide all required fields" });
        }
        let cartItem = await Cart.findOne({ userId, _id: productId }).populate({
            path: "productId",
            select: "title description price",
        });
        if (!cartItem) {
            return res.status(404).json({
                message: `Cart item not found for product ${productId} and user ${userId}`,
                status: 404,
                success: false,
            });
        }
        // Update the quantity of the cart item
        cartItem.quantity = quantity;
        cartItem.totalPrice = cartItem.productId.price * quantity;
        await cartItem.save();
        res.status(200).json({
            message: "Cart item updated successfully",
            status: 200,
            data: cartItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            status: 500,
            success: false,
        });
    }
};

export const deleteUserCart = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log("id----->", id);
        const userCart = await Cart.findByIdAndDelete(id);
        // If cart item doesn't exist, return error
        if (!userCart) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Cart item not found",
            });
        }
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Cart item remove successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
            status: 500,
        });
    }
};
