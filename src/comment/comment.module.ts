import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './comment.model';
import { CommentRepository } from './comment.repository';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from 'src/auth/auth.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'User', schema: UserSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY_JWT'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN_REFRESH_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    JwtStrategy,
    AuthService,
    AuthRepository,
  ],
})
export class CommentModule {}
