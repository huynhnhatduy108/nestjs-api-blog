import { IsArray, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateContactDto {
    full_name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    content: string;

}