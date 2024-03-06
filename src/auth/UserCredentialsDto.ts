import { IsEmail, IsNotEmpty } from 'class-validator';

export default class UserCredentialsDto {
  @IsEmail()
  username: string;
  @IsNotEmpty()
  password: string;
}
