import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';
import {NotificationDto} from '../notification/dto/create_notification.dto';
import { UpdateNotificationDto } from 'src/notification/dto/update_notification.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly notificationService : NotificationService , private prismaService : PrismaService){}
  create(user : CreateUserDto): Promise<User | null>{
    return null
  }
  updateProfile = async (user_id : number , update_dto : any): Promise<any> => {}
  enablePush = async (
    user_id : number, 
    update_dto : NotificationDto,
  ) : Promise<any> => {}
  
  disablePush = async(
    user_id : number,
    update_dto : UpdateNotificationDto,
  ) : Promise<any> => {}

  getPushNotifications = async () : Promise<any> => {}

}
