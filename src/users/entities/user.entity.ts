import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({
    description: 'id of the user in database',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'user name of the user in database',
    default: '',
    type: String,
  })
  userName: string;

  @ApiProperty({
    description:
      'this is phone number of a user which cannot be duplicated in the databse and its unique',
    type: String,
  })
  phoneNumber: string;

  @ApiProperty({
    description:
      'password is uniqe in database and you cannot have a same password as any one elses',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'status can be ACTIVE or INACTIVE due to the system',
    type: String,
  })
  status: string;
}
