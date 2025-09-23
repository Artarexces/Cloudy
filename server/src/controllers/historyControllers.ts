import { Response } from "express";
import History from "../models/History";
import { AuthRequest } from "../middlewares/auth";

export const getHistroy = async (req: AuthRequest, res: Response ) => {
    try {
        if (!req.userId){
            return res.status(401).json({ error: "Usuario no autenticado."});
        }

    const docs = await History.find({ user: req.userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select("city timestamp -_id")
      .lean()
      .exec();

    return res.json(docs);
    } catch (err) {
        console.error("history error:", err)
        return res.status(500).json({ error: "Error en el servido." });
    }
}