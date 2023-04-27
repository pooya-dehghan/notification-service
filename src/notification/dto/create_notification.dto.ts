import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  notification_token: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  device_type: string;
}
