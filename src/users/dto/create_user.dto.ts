import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'name of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
  @ApiProperty({
    description: 'phone number of the user which should be uniqu',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty({
    description: 'password of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
