import { Schema, Document, ObjectId } from 'mongoose';

const ContactSchema = new Schema(
  {
    full_name: String,
    email: String,
    subject: String,
    content: String,

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_flag: { type: Boolean, default: false },
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

  created_at: string;
  updated_at: string;
  deleted_flag: boolean;
}

