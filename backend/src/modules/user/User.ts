import mongoose, { Schema, Document } from "mongoose";
import { ROLES } from "../../constants/roles.js";
import type { Role } from "../../constants/roles.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, trim: true , lowercase: true},
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.PARTICIPANT },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
