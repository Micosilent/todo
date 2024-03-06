import { IsNumberString } from 'class-validator';

export default class FindTaskDto {
  @IsNumberString()
  id: number;
}
