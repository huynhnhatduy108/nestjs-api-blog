import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCommentDto {
    
    parentId:ObjectId;

    @IsNotEmpty()
    postId:ObjectId;

    title: string;

    @IsNotEmpty()
    content: string;

}


export class UpdateCommentDto {
    parentId:ObjectId;

    @IsNotEmpty()
    postId:ObjectId;

    title: string;

    @IsNotEmpty()
    content: string;

}
