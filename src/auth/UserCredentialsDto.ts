import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UserCredentialsDto {
  @IsEmail()
  @ApiProperty()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
