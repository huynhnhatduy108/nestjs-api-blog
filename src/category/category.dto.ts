import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    thumbnail: string;

    description: string;
}

export class UpdateCategoryDto {
    @IsNotEmpty()
    name: string;

    thumbnail: string;
    
    description: string;
}
