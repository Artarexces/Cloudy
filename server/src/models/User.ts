import { Document, Schema } from "mongoose";
import mongoose from "mongoose";
import bycrypt from "bcrypt";


export interface IUser extends Document {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true}
})


userSchema.pre<IUser>('save', async function (next){
    if (!this.isModified('password')) return next();
    try {
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bycrypt.compare(candidate, this.password);
}

export default mongoose.model<IUser>("User", userSchema)