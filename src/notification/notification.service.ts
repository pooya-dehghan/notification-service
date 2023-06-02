import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { NotificationDto } from './dto/create_notification.dto';
import { UpdateNotificationDto } from './dto/update_notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-adminsdk.json'),
  ),
});
@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}
  acceptPushNotification = async (
    user: User,
    notification_dto: NotificationDto,
  ): Promise<NotificationDto> => {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'ACTIVE',
      },
    });
    const createdNotificationToken =
      await this.prismaService.notificationToken.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          device_type: notification_dto.device_type,
          notification_token: notification_dto.notification_token,
        },
        include: {
          user: true,
        },
      });
    return createdNotificationToken;
  };

  disablePushNotification = async (
    user: User,
    update_dto: UpdateNotificationDto,
  ): Promise<UpdateNotificationDto> => {
    try {
      await this.prismaService.notificationToken.updateMany({
        where: {
          userId: user.id,
          device_type: update_dto.device_type,
        },
        data: {
          status: 'INACTIVE',
        },
      });
    } catch (error) {
      return error;
    }
  };

  getNotifications = async (): Promise<any> => {
    return await this.prismaService.notification.findMany();
  };

  sendPush = async (
    user_id: number,
    title: string,
    body: string,
  ): Promise<void> => {
    try {
      const notification_token =
        await this.prismaService.notificationToken.findFirst({
          where: {
            userId: user_id,
            status: 'ACTIVE',
          },
        });
      if (notification_token) {
        await this.prismaService.notification.create({
          data: {
            title: title,
            body: body,
            notificationTokenId: notification_token.id,
            status: 'ACTIVE',
          },
        });
      }
      await firebase
        .messaging()
        .send({
          notification: { title, body },
          token: notification_token.notification_token,
        })
        .catch((error: any) => {
          console.error('error while sending message: ', error);
        });
    } catch (error) {
      return error;
    }
  };
}
