import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async GetAllNotifications() {
    return this.notificationService.getNotifications();
  }
}
