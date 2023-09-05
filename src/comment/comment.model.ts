import { Schema, Document, ObjectId } from 'mongoose';

const CommentSchema = new Schema(
  {
    parentId:{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,

      },
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: null,
      },
    title:  { type: String, default: '' },
    content:  { type: String, default: '' },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
  parentId:ObjectId;
  postId:ObjectId;
  title: string;
  content: string;
  author: ObjectId;
  createdAt:string;
  updatedAt:string;
  deletedFlag:boolean;

}