import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  private readonly hardcodedUser = {
    username: 'root',
    password: '123456',
  };

  validateUser(username: string, password: string) {
    const valid =
      username === this.hardcodedUser.username &&
      password === this.hardcodedUser.password;
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return { username };
  }

  login(user: { username: string }) {
    const payload = { sub: user.username };
    const token = this.jwt.sign(payload);
    return { access_token: token, user: user.username };
  }
}
