import { IsArray, IsNotEmpty, IsEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class registerDto {
    @IsNotEmpty()
    username: string;

    fullName: string;

    @IsNotEmpty()
    email: string;

    address: string;

    phone: string;

    intro: string;

    profile: string;
    
    @IsNotEmpty()
    password: string;

    role: number;

    sex: string;

    avatarUrl: string;
    
    provider: string;

}

export class loginDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;

}