import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_dto.dto';
import { UsersService } from './users.service';
import { NotificationDto } from 'src/notification/dto/create_notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update_notification.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserEntity,
  })
  @HttpCode(HttpStatus.OK)
  async CreateUser(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @Put('update/:id')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() update_dto: any,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    user_id: number,
  ) {
    return await this.usersService.updateProfile(user_id, update_dto);
  }

  @Put('push/enable/:id')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @HttpCode(HttpStatus.OK)
  async enablePush(
    @Body() update_dto: NotificationDto,
    @Param('id', ParseIntPipe) user_id: number,
  ) {
    return await this.usersService.enablePush(user_id, update_dto);
  }

  @Put('push/disable/:id')
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async disablePush(
    @Param('id', ParseIntPipe) user_id: number,
    @Body() update_dto: UpdateNotificationDto,
  ) {
    return await this.usersService.disablePush(user_id, update_dto);
  }

  @Put('update/:id')
  @ApiOkResponse({ type: UserEntity })
  @HttpCode(HttpStatus.OK)
  async updateUserProfile(
    @Param('id', ParseIntPipe) user_id: number,
    @Body() update_dto: UpdateUserDto,
  ) {
    this.usersService.updateProfile(user_id , update_dto)
  }
}
