import { IsArray, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateContactDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    content: string;

}

export class UpdateContactDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    content: string;

}