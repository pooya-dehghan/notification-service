import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationDto } from './dto/create_notification.dto';
import { UpdateNotificationDto } from './dto/update_notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

const firebaseConfig = {
  apiKey: 'AIzaSyAX1EFyU4OU32MK3DdMYX52GmCp_fOCxJ0',
  authDomain: 'notification-service-366f8.firebaseapp.com',
  projectId: 'notification-service-366f8',
  storageBucket: 'notification-service-366f8.appspot.com',
  messagingSenderId: '976028950264',
  appId: '1:976028950264:web:65ce91b122ed6017e7a50d',
  measurementId: 'G-6WFYCTXLDN',
};
firebase.initializeApp(firebaseConfig);
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

  sendPush = async (user: any, title: string, body: string): Promise<void> => {
    try {
      const notification_token =
        await this.prismaService.notificationToken.findFirst({
          where: {
            userId: user.id,
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
          android: { priority: 'high' },
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error) {
      return error;
    }
  };
}
