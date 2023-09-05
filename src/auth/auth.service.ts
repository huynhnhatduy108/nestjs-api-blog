import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  comparePassword,
  convertStringToObjectOrdering,
  hashPassword,
} from 'src/helper/function';
import { registerDto, loginDto, facebookLoginDto, googleLoginDto} from './auth.dto';
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
          
      return {username, accessToken, refreshToken, fullName: user["fullName"], email: user["email"], avatarUrl: user["avatarUrl"]  };
    }
    throw new HttpException('Wrong email or password', HttpStatus.UNAUTHORIZED);
  }

  async facebookLogin(facebookLoginDto: facebookLoginDto) {
    const { username, email, fullName, avatarUrl } = facebookLoginDto;
    const user = await this.authRepo.findOne({
      $or: [
        { username: email } ,
        { email:  email } 
    ]
    });
    if (!user) {
      const userCreate ={
          username,
          email, 
          fullName, 
          avatarUrl,
          provider:"FACEBOOK",
      }
     const newUser = await this.authRepo.create({
      ...userCreate,
      });

      const { accessToken, refreshToken} = await this.createToken(newUser._id);
      return { username, email, fullName, avatarUrl, accessToken, refreshToken, };

    }
    else{
      const { accessToken, refreshToken} = await this.createToken(user._id);
      return {username, accessToken, refreshToken, fullName: user["fullName"], email: user["email"], avatarUrl: user["avatarUrl"]};
    }
  
  }

  async googleLogin(googleLoginDto: googleLoginDto) {
    const { username, email, fullName, avatarUrl } = googleLoginDto;
    const user = await this.authRepo.findOne({
      $or: [
        { username: email } ,
        { email:  email } 
    ]
    });
    if (!user) {
      const userCreate ={
          username,
          email, 
          fullName, 
          avatarUrl,
          provider:"FACEBOOK",
      }
     const newUser = await this.authRepo.create({
      ...userCreate,
      });

      const { accessToken, refreshToken} = await this.createToken(newUser._id);
      return { username, email, fullName, avatarUrl, accessToken, refreshToken, };

    }
    else{
      const { accessToken, refreshToken} = await this.createToken(user._id);
      return {username, accessToken, refreshToken, fullName: user["fullName"], email: user["email"], avatarUrl: user["avatarUrl"]};
    }
  }
  
}
