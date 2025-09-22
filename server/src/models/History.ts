import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  city: string;
  timestamp: Date;
}

const historySchema: Schema<IHistory> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true}
})