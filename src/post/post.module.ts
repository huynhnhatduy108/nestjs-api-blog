import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.model';
import { CategoryRepository } from 'src/category/category.repository';
import { CategorySchema } from 'src/category/category.model';
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
      { name: 'Post', schema: PostSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'User', schema: UserSchema }
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
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    CategoryRepository,
    JwtStrategy,
    AuthService,
    AuthRepository,
  ],
})
export class PostModule {}
