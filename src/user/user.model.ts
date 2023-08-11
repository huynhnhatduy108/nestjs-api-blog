import { Schema, Document, ObjectId } from 'mongoose';

const UserSchema = new Schema(
  {
    username: String,
    full_name: String,
    email: String,
    address: String,
    phone: String,
    intro: String,
    profile: String,
    password: String,
    role: Number,
    sex: String,
    avatar_url: String,
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
  full_name: string;
  email: string;
  address: string;
  phone: string;
  intro: string;
  profile: string;
  password: string;
  role: number;
  sex: string;
  avatar_url: string;
  provider: string;

  createdAt: string;
  updatedAt: string;
  deletedFlag: boolean;
}
