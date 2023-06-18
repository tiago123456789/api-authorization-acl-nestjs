import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';
import { PermissionDto } from '../dtos/permission.dto';
import { HasPermission } from 'src/security/has-permission.decorater';
import permission from 'src/common/types/permission';
import { SecurityGuard } from 'src/security/security.guard';

@Controller('/roles/:id/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @HasPermission(permission.ADMIN.LIST_ROLE_PERMISSION)
  @UseGuards(SecurityGuard)
  @Get('/')
  getAllById(@Param('id') roleId: number): Promise<Permission[]> {
    return this.permissionService.getAllByRoleId(roleId);
  }

  @HasPermission(permission.ADMIN.CREATE_ROLE_PERMISSION)
  @UseGuards(SecurityGuard)
  @Post('/')
  @HttpCode(201)
  create(
    @Param('id') roleId: number,
    @Body() permissionDto: PermissionDto,
  ): Promise<void> {
    return this.permissionService.create(roleId, permissionDto);
  }
}
