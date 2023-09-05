import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  comparePassword,
  convertStringToObjectOrdering,
  hashPassword,
} from 'src/helper/function';
import { registerDto, loginDto } from './auth.dto';
import { UserQuery } from './auth.interface';
import { ObjectId } from 'bson';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async profileUser(userId: string) {
    const pipeline = [
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $project: {
          password: 0,
          deletedFlag: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ];

    const users = await this.authRepo.aggregate(pipeline);

    let user = null;
    if (users.length > 0) {
      user = users[0];
    }

    if (!user) throw new HttpException('user not found', 404);

    return user;
  }

  async register(registerDto: registerDto) {
    const { username, password, email } = registerDto;

    const userExist = await this.authRepo.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (userExist)
      throw new HttpException('Username or email was existed!', 401);

    const passswordHash = await hashPassword(password);

    const newUser = await this.authRepo.create({
      ...registerDto,
      password: passswordHash,
    });

    return registerDto;
  }

  async login(loginDto: loginDto) {
    const { username, password } = loginDto;
    const user = await this.authRepo.findOne({
      username: username,
    });
    if (user) {
      const isEqual = comparePassword(password, user.password);
      if (!isEqual)
        throw new HttpException(
          'Wrong email or password',
          HttpStatus.UNAUTHORIZED,
        );
      const { accessToken, refreshToken} = await this.createToken(user._id);
          
      return {username, accessToken, refreshToken};
    }
    throw new HttpException('Wrong email or password', HttpStatus.UNAUTHORIZED);
  }

  private async createToken(userId) {
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.SECRETKEY_JWT,
        expiresIn: process.env.EXPIRESIN_REFRESH_TOKEN,
      },
    );

    const accessToken = this.jwtService.sign(
      { userId },
      {
        secret: process.env.SECRETKEY_JWT,
        expiresIn: process.env.EXPIRESIN_ACCESS_TOKEN,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }


  async validateUser(userId) {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  
}
