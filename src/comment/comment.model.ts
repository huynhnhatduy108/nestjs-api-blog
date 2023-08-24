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
    title:  { type: String, default: '' },
    content:  { type: String, default: '' },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedFlag: { type: Boolean, default: false },

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

  createdAt:string;
  updatedAt:string;
  deletedFlag:boolean;

}