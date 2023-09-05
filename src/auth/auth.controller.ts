import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { registerDto, loginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get(':userId')
    async profileUser(@Param('userId') userId:string) {
        const user = await this.authService.profileUser(userId);
        return user;
    }

    @Post('/register')
    async register(@Body() registerDto: registerDto) {
        const user = await this.authService.register(registerDto);
        return user;
    }

    @Post('/login')
    async login(@Body() loginDto: loginDto) {
        const res = await this.authService.login(loginDto);
        return res;
    }


    @Post('/facebook')
    async facebookLogin() {
        return {};
    }

    @Post('/google')
    async googleLogin() {
        return {};
    }





}
