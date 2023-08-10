import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCategoryDto {
    name: string;
    slug: string;
    thumbnail: string;
    description: string;
}
