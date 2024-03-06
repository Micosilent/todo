import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
