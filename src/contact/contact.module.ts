import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactSchema } from './contact.model';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from 'src/auth/auth.model';
import { AuthRepository } from 'src/auth/auth.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Contact', schema: ContactSchema },
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
  controllers: [ContactController],
  providers: [
    ContactService,
    ContactRepository,
    JwtStrategy,
    AuthService,
    AuthRepository,
  ],
})
export class ContactModule {}
