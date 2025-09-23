import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";


export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if(!username || !password)
        return res.status(401).json({ error: "Usuario y contraseña son obligatorios!" })
    
    try {
        const exists = await User.findOne({ username })
        if (exists) return res.status(400).json({ error: "El usuario ya existe."})

        const user = new User({ username, password })
        await user.save();
        res.status(200).json({ msg: "Usuario registrado correctamente!"})
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor." })
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ error: "Credenciales invalidas."})

        const matchUser = await user.comparePassword(password);
        if(!matchUser) return res.status(400).json({ error: "Credenciales invalidas."});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d"});
        res.json({ token })

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor"})
    }
};

