import { Schema, Document, ObjectId } from 'mongoose';

const PostSchema = new Schema(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    summary: { type: String, default: '' },
    title: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    slug: { type: String, default: '' },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    thumnail: { type: String, default: '' },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: [String],
    views: { type: Number, default: 0 },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    publishedAt: { type: Date, default: Date.now },
    isPublic:{ type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedFlag: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'post',
  },
);

export { PostSchema };

export interface Post extends Document {
  parent: ObjectId;
  title: string;
  summary: string;
  metaTitle: string;
  slug: string;

  description: string;
  content: string;
  thumnail: string;
  author: ObjectId;
  tags: [string];
  views: number;
  categories: [ObjectId];
  publishedAt: string;
  isPublic: boolean;

  createdAt: string;
  updatedAt: string;
  deletedFlag: boolean;
}
