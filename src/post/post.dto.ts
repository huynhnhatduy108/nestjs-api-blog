import { IsArray, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreatePostDto {
    parent:ObjectId;

    @IsNotEmpty()
    title: string;

    summary: string;

    meta_title: string;

    description: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    thumnail:string;

    @IsArray()
    tags: [string];

    views: number;

    @IsArray()
    categories: [ObjectId];

    published_at:string;

}
