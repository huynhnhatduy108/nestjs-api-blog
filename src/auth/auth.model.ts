import { Schema, Document, ObjectId } from 'mongoose';

const UserSchema = new Schema(
  {
    username:{ type: String, default:"" },
    fullName:{ type: String, default:"" },
    email: { type: String, default:"" },
    address:{ type: String, default:"" },
    phone:{ type: String, default:"" },
    intro:{ type: String, default:"" },
    profile: { type: String, default:"" },
    password: { type: String, default:"" },
    role:{ type: Number, default:0 },
    sex: { type: String, default:"MEN" },
    avatarUrl:{ type: String, default:"" },
    provider: { type: String, default:"LOCAL" },

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
