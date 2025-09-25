import { Router } from "express";
import { protect } from "../middlewares/auth";
import { weather } from "../controllers/weatherControllers";
import { getHistroy } from "../controllers/historyControllers";
import { register, login, logout } from "../controllers/authControllers";

const router = Router()

//Login & register
router.post("/register/", register);
router.post("/login/", login);
router.post("/logout/",protect, logout);
router.post("/register/", register);


//Weather & forecast 
router.get("/weather/", protect, weather);
router.get("/history/", protect, getHistroy)

export default router