import {
  UseGuards,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UpdateUserDto } from './user.dto';
import { UserQuery } from './user.interface';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getListUser(@Req() req: Request, @Query() condition: UserQuery) {    
    const user = await this.userService.getListUser(condition);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    const user = await this.userService.getDetailUserById(userId);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async creareUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(userId, updateUserDto);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);
    return user;
  }
}
