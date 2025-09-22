import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  city: string;
  timestamp: Date;
}

const historySchema: Schema<IHistory> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    city: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

export default mongoose.model<IHistory>("History", historySchema)