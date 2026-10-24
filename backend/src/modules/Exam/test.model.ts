import mongoose, { Schema, Document } from "mongoose";

export interface ITest extends Document {
  title: string;
  description?: string;
  classId: mongoose.Types.ObjectId;
  duration: number;
  isPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const testSchema = new Schema<ITest>(
  {
    title: { type: String, required: true },
    description: { type: String },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    duration: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const TestModel = mongoose.model<ITest>("Test", testSchema);
