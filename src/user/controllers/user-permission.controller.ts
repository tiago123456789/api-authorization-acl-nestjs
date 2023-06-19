import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SecurityGuard } from 'src/security/security.guard';
import { HasPermission } from 'src/security/has-permission.decorater';
import permission from 'src/common/types/permission';
import { UserPermissionDto } from '../dtos/user-permission.dto';

@Controller()
export class UserPermissionController {
  constructor(private readonly userService: UserService) {}

  @HasPermission(permission.ADMIN.ADD_PERMISSION_TO_USER)
  @UseGuards(SecurityGuard)
  @Post('/users-permissions-apply')
  @HttpCode(201)
  async apply(@Body() userPermission: UserPermissionDto): Promise<void> {
    await this.userService.applyPermissionToUser(userPermission);
  }

  @HasPermission(permission.ADMIN.REMOVE_PERMISSION_TO_USER)
  @UseGuards(SecurityGuard)
  @Delete('/users-permissions-remove')
  @HttpCode(201)
  async remove(@Body() userPermission: UserPermissionDto): Promise<void> {
    await this.userService.removePermissionToUser(userPermission);
  }
}
