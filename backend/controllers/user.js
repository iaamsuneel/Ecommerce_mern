import { comparedPassword, hashPassword } from "../helpers/authHelpers";
import JWT from "jsonwebtoken";
import User from "../models/User";
// Register user || Method Post
export const registerUser = async (req, res) => {
	try {
		const { name, email, password, mobileNo } = req.body;
		if (!name || !email || !password || !mobileNo) {
			return res
				.status(400)
				.json({ success: false, error: "All fields are required" });
		}
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				status: 400,
				message: "User already registered, Please login",
			});
		}
		// Hashed password
		const hashedPassword = await hashPassword(password);
		// Create new user
		const newUser = new User({
			name,
			email,
			mobileNo,
			password: hashedPassword,
		});
		// Save user to the database
		await newUser.save();
		//  success response
		res.status(201).json({
			success: true,
			status: 200,
			message: "User registered successfully",
			data: newUser,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
			error: error.message,
		});
	}
};
// Login User || Method Post
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Checking if email and password are provided
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide both email and password",
			});
		}
		// Checking if user exists
		const userInfo = await User.findOne({ email });
		if (!userInfo) {
			return res.status(404).json({
				success: false,
				message: "User not found. Please register.",
			});
		}
		// Comparing passwords
		const passwordMatched = await comparedPassword(
			password,
			userInfo.password
		);
		if (!passwordMatched) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid email or password" });
		}
		// Creating JWT token
		const token = JWT.sign(
			{ _id: userInfo._id },
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "2d" }
		);
		// Sending success response with token and user data
		res.status(200).json({
			success: true,
			message: "Login Successfully",
			status: 200,
			token,
			data: {
				name: userInfo.name,
				email: userInfo.email,
				mobileNo: userInfo.mobileNo,
			},
		});
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
