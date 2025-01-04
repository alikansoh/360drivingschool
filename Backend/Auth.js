import  jwt from "jsonwebtoken";
import User from "../Model/User.js"
export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }   
}