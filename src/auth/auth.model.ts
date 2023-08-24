import { Schema, Document, ObjectId } from 'mongoose';

const UserSchema = new Schema(
  {
    username: String,
    fullName: String,
    email: String,
    address: String,
    phone: String,
    intro: String,
    profile: String,
    password: String,
    role: Number,
    sex: String,
    avatarUrl: String,
    provider: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedFlag: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'user',
  },
);

export { UserSchema };

export interface User extends Document {
  username: string;
  fullName: string;
  email: string;
  address: string;
  phone: string;
  intro: string;
  profile: string;
  password: string;
  role: number;
  sex: string;
  avatarUrl: string;
  provider: string;

  createdAt: string;
  updatedAt: string;
  deletedFlag: boolean;
}
