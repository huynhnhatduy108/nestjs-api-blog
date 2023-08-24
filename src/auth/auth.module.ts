import { Module } from '@nestjs/common';
import { UserController } from './auth.controller';
import { UserRepository } from './auth.repository';
import { UserService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth.model';

@Module({
  imports:[MongooseModule.forFeature([{name:"User", schema:UserSchema}])],
  controllers: [UserController],
  providers: [UserService, UserRepository]
})
export class UserModule {}
