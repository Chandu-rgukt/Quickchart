import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
    try {
        // FIX: Read token from Authorization header
        let token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const checkAuth = (req, res) => {
    res.json({ success: true, userData: req.user });
};
