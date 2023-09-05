import { Controller, Get, Param, Post, Put, Body, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { registerDto, loginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    async profileUser(@Req() req: Request) {
        const  userId= req["user"]._id
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
    async facebookLogin(@Body() facebookLoginDto) {
        return {};
    }

    @Post('/google')
    async googleLogin(@Body() googleLoginDto) {
        return {};
    }



}
