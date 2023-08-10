import { Schema, Document, ObjectId } from 'mongoose';

const CategorySchema = new Schema(
  {

    name: String,
    slug: String,
    thumbnail: String,
    description: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_flag: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    collection: 'comment',
  },
);


export { CategorySchema };

export interface Category extends Document {
  name: string;
  slug: string;
  thumbnail: string;
  description: string;

  created_at:string;
  updated_at:string;
  deleted_flag:boolean;

}
