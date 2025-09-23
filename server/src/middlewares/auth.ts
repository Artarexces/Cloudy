import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.header("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth.startsWith("Token ") ? auth.slice(6) : null;
  if (!token) return res.status(401).json({ error: "No autorizado." });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: "JWT_SECRET no definido." });

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ error: "Token no válido." });
  }
};
