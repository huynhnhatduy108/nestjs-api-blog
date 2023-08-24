import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';

@Module({
  imports:[MongooseModule.forFeature([{name:"User", schema:UserSchema}])],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
