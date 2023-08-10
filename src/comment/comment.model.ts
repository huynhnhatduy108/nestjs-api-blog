import { Schema, Document, ObjectId } from 'mongoose';

const CommentSchema = new Schema(
  {
    parent:{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    post:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    title: String,
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_flag: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    collection: 'comment',
  },
);


export { CommentSchema };

export interface Comment extends Document {
  parent:ObjectId;
  post:ObjectId;
  title: string;
  content: string;
  
  author: ObjectId;

  created_at:string;
  updated_at:string;
  deleted_flag:boolean;

}