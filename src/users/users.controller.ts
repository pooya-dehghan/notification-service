import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { UsersService } from './users.service';
import { NotificationDto } from 'src/notification/dto/create_notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update_notification.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @Put()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Body() update_dto: any, @Param('id') user_id: number) {
    return await this.usersService.updateProfile(user_id, update_dto);
  }

  @Put('push/enable')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  async enablePush(
    @Body() update_dto: NotificationDto,
    @Param('id') user_id: number,
  ) {
    return await this.usersService.enablePush(user_id, update_dto);
  }

  @Put('push/disable')
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async disablePush(
    @Param('id') user_id: number,
    @Body() update_dto: UpdateNotificationDto,
  ) {
    return await this.usersService.disablePush(user_id, update_dto);
  }
}
