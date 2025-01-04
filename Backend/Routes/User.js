import exprss from "express";
const router = exprss.Router();
import { createUser, getUserById, getAllUsers, updateUser, deleteUser , login} from "../Controller/User.js";  

router.post("/", createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
