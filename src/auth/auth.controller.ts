import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import UserCredentialsDto from './UserCredentialsDto';
import { Public } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signup')
  signUp(@Body() signUpDto: UserCredentialsDto) {
    return this.authService.signUp(signUpDto.username, signUpDto.password);
  }

  // We need to explicitly set status code, as we are not creating a resource
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  logIn(@Body() signUpDto: UserCredentialsDto) {
    return this.authService.logIn(signUpDto.username, signUpDto.password);
  }
}
