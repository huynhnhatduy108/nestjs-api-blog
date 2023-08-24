import { Schema, Document, ObjectId } from 'mongoose';

const ContactSchema = new Schema(
  {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    subject: { type: String, default: '' },
    content: { type: String, default: '' },

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
  fullName: string;
  email: string;
  subject: string;
  content: string;

  createdAt: string;
  updatedAt: string;
  deletedFlag: boolean;
}

