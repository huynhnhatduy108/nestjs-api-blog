import { IsArray, IsNotEmpty, IsEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class UpdateUserDto {
    @IsEmpty()
    username: string;

    fullName: string;

    @IsEmpty()
    email: string;

    address: string;

    phone: string;

    intro: string;

    profile: string;
    
    @IsEmpty()
    password: string;

    role: number;

    sex: string;

    avatarUrl: string;
    
    provider: string;

}