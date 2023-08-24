import { Controller, Get, Param, Post, Put, Body, Delete, Query } from '@nestjs/common';
import { UpdateUserDto } from './auth.dto';
import { UserQuery } from './auth.interface';
import { UserService } from './auth.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getListUser(@Query() condition:UserQuery) {        
        const user = await this.userService.getListUser(condition);        
        return user;
    }

    @Get(':userId')
    async getUserById(@Param('userId') userId:string) {
        const user = await this.userService.getDetailUserById(userId);
        return user;
    }

    @Put(':userId')
    async updateUser(@Param('userId') userId:string ,@Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.updateUser(userId, updateUserDto);
        return user;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        const user = await this.userService.deleteUser(id);
        return user;
    }
}
