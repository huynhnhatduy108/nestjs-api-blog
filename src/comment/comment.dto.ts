import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCommentDto {
    parent:ObjectId;

    @IsNotEmpty()
    post:ObjectId;

    title: string;

    @IsNotEmpty()
    content: string;

}


export class UpdateCommentDto {
    parent:ObjectId;

    @IsNotEmpty()
    post:ObjectId;

    title: string;

    @IsNotEmpty()
    content: string;

}
