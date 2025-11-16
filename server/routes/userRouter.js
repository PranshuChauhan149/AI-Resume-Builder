import express from "express"
import { getUserById, getUserResume, LoginUser, registerUser } from "../controllers/UserController.js";
import protect from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/reqister',registerUser)
userRouter.post("/login",LoginUser)
userRouter.get("/data",protect,getUserById)
userRouter.get("/resumes",protect,getUserResume)

export default userRouter