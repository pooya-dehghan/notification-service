import { Injectable, BadRequestException } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';
import { NotificationDto } from '../notification/dto/create_notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update_notification.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update_dto.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly notificationService: NotificationService,
    private prismaService: PrismaService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    let newUser = await this.prismaService.user.create({
      data: {
        ...user,
      },
    });
    delete newUser.password;
    return newUser;
  }

  updateProfile = async (user_id: number, update_dto: UpdateUserDto): Promise<any> => {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: user_id,
        },
      });
      const updatedUser = {
        ...user,
        phoneNumber: update_dto.phoneNumber,
        userName: update_dto.userName,
      };
      const saved_user = await this.prismaService.user.update({
        where: {
          id: user_id,
        },
        data: {
          ...updatedUser,
        },
      });
      if (saved_user) {
        await this.notificationService
          .sendPush(
            updatedUser.id,
            'profile_updated',
            'your profile has been updated successfuly',
          )
          .catch((err) => {
            console.log('Error sending push notification', err);
            throw new BadRequestException();
          });
      }
      return saved_user;
    } catch (err) {
      throw new BadRequestException();
    }
  };

  enablePush = async (
    user_id: number,
    update_dto: NotificationDto,
  ): Promise<any> => {
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });
    return await this.notificationService.acceptPushNotification(
      user,
      update_dto,
    );
  };

  disablePush = async (
    user_id: number,
    update_dto: UpdateNotificationDto,
  ): Promise<any> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: user_id,
      },
    });
    return await this.notificationService.disablePushNotification(
      user,
      update_dto,
    );
  };

  getPushNotifications = async (): Promise<any> => {
    return this.notificationService.getNotifications();
  };
}
