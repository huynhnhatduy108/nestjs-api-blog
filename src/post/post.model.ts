import { Schema, Document, ObjectId } from 'mongoose';

const PostSchema = new Schema(
  {
    parent:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    summary:String,
    title: String,
    meta_title: String,
    slug: String,
    description: String,
    content: String,
    thumnail:String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [String],
    views: Number,
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    published_at: { type: Date, default: Date.now },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_flag: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    collection: 'post',
  },
);


export { PostSchema };

export interface Post extends Document {
  parent:ObjectId;
  title: string;
  summary: string;
  meta_title: string;
  slug: string;

  description: string;
  content: string;
  thumnail:string;
  author: ObjectId;
  tags: [string];
  views: number;
  categories: [ObjectId];

  published_at:string;
  created_at:string;
  updated_at:string;
  deleted_flag:boolean;

}