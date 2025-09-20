import { connect } from "mongoose";

process.loadEnvFile();

const URI_DB = process.env.URI_DB || "";

export const connectDB = async () => {
    try {
        await connect(URI_DB!);
        console.log("Conectado a MongoDB con exito!🍃");
    } catch (error) {
        console.error(`🛑 Error al conectarse al servidor de Mongo DB | ${(error as Error).message}`);
    }
}