import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCommentDto {
    parent:ObjectId;
    post:ObjectId;

    title: string;

    @IsNotEmpty()
    content: string;
      
}
