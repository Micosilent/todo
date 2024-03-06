import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

export type jwtPayload = {
  username: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getJWToken(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  async logIn(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await user.comparePassword(password))) {
      return this.getJWToken(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signUp(username: string, password: string) {
    if (await this.usersService.findOne(username)) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.usersService.create(username, password);

    return this.getJWToken(user);
  }
}
