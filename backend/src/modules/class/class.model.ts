import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  description?: string;
  creatorId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    description: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joinCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const ClassModel = mongoose.model<IClass>("Class", ClassSchema);
