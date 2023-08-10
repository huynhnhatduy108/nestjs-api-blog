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

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_flag: { type: Boolean, default: false },
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

  created_at: string;
  updated_at: string;
  deleted_flag: boolean;
}
