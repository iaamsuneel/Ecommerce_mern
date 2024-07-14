import jwt from "jsonwebtoken";
export const isCheckAuth = (req, res, next) => {
    // Extract the token from request header
    const token = req.headers.authorization;
    // Check if token is missing
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Please login to get access",
            status: 400,
        });
    }
    try {
        // Verify the token
        const user = jwt.verify(token, "ALLAHABAD212507");
        // Check if user exists in the token payload
        if (!user) {
            return res
                .status(400)
                .json({ message: "Unauthorized Request", success: false });
        }
        // If user exists, attach user ID to the request object
        req.userId = user._id;
        // Pass control to the next middleware function
        next();
    } catch (error) {
        // If an error occurs during token verification, respond with an error message
        return res
            .status(400)
            .json({ message: "Invalid token", success: false });
    }
};
