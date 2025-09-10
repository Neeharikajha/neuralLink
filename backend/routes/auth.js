import express from "express";
import {signup, login} from '../controllers/auth.js';
import { changePassword } from "../controllers/auth.js";
import { deleteUser } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";


const router= express.Router();
 router.post("/signup", signup);
 router.post("/login", login);
 router.put("/change-password",protect, changePassword);
 router.delete('/delete', protect, deleteUser);

 export default router; 