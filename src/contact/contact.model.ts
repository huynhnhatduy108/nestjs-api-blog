import { Schema, Document, ObjectId } from 'mongoose';

const ContactSchema = new Schema(
  {
    full_name: String,
    email: String,
    subject: String,
    content: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedFlag: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'contact',
  },
);

export { ContactSchema };

export interface Contact extends Document {
  full_name: string;
  email: string;
  subject: string;
  content: string;

  createdAt: string;
  updatedAt: string;
  deletedFlag: boolean;
}

