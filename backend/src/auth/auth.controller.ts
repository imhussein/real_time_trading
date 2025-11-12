import { Body, Controller, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Version('1')
  @Post('api/auth/login')
  login(@Body() dto: LoginDto) {
    const user = this.auth.validateUser(dto.username, dto.password);
    return this.auth.login(user);
  }
}
