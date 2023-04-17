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
  
  create(user : CreateUserDto): Promise<User>{
    let newUser = this.prismaService.user.create({
      data : {
       ...user
      }
    })
    return newUser
  }

  updateProfile = async (user_id : number , update_dto : any): Promise<any> => {
    try{
      const user = await this.prismaService.user.findUnique({
        where: {
          id : user_id
        }
      })
      const updatedUesr = {
        ...user,
        phoneNumber : update_dto.phoneNumber,
        userName : update_dto.userName
      }
      const saved_user = await this.prismaService.user.update({
        where : {
          id : user_id
        },
        data : {
          ...updatedUesr
        }
      })
      if(saved_user){
        await this.notificationService.sendPush(
          updatedUesr,
          "profile_updated",
          "your profile has been updated successfuly"
        ).catch(err => {
      console.log('Error sending push notification' , err)

        })
      } 
      return saved_user
    }catch(err){
      return err
    }
  }
  
  enablePush = async (
    user_id : number, 
    update_dto : NotificationDto,
  ) : Promise<any> => {
    const user = await this.prismaService.user.findUnique({
      where : {id : user_id}
    }) 
    return await this.notificationService.acceptPushNotification(user , update_dto)
  }
  
  disablePush = async(
    user_id : number,
    update_dto : UpdateNotificationDto,
  ) : Promise<any> => {
    const user =  await this.prismaService.user.findUnique({
      where : {
        id : user_id
      }
    })
    return await this.notificationService.disablePushNotification(
      user,
      update_dto
    )
  }

  getPushNotifications = async () : Promise<any> => {
    return this.notificationService.getNotifications()
  }

}
