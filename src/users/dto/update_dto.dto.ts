import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'updating name for user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
  @ApiProperty({
    description: 'updating phone number for the user which should be unique',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
