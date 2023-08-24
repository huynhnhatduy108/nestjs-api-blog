import { Schema, Document, ObjectId } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: { type: String, default: '' },
    slug: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    description: { type: String, default: '' },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedFlag: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    collection: 'category',
  },
);


export { CategorySchema };

export interface Category extends Document {
  name: string;
  slug: string;
  thumbnail: string;
  description: string;

  createdAt:string;
  updatedAt:string;
  deletedFlag:boolean;

}
