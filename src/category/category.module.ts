import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategorySchema } from './category.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from 'src/post/post.repository';
import { PostSchema } from 'src/post/post.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserSchema } from 'src/auth/auth.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Post', schema: PostSchema },
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
  providers: [
    CategoryService,
    CategoryRepository,
    PostRepository,
    JwtStrategy,
    AuthService,
    AuthRepository,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
