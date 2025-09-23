import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import cors from "cors"

const PORT = process.env.PORT || 8500

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();

app.use("/api", router);

app.get("/", (req, res) => res.send("API is running 🏃‍♂️")) 

app.listen(PORT, () => {
    connectDB();
    console.log(`Servidor en escucha 🚀 | ${PORT}`)
})