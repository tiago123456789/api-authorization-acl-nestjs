import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { Role } from '../entities/role.entity';
import { RoleDto } from '../dtos/role.dto';
import { HasPermission } from 'src/security/has-permission.decorater';
import permission from 'src/common/types/permission';
import { SecurityGuard } from 'src/security/security.guard';

@Controller('roles')
export class RoleControllerController {
  constructor(private readonly roleService: RoleService) {}

  @HasPermission(permission.ADMIN.LIST_ROLE)
  @UseGuards(SecurityGuard)
  @Get('/')
  getAll(): Promise<Role[]> {
    return this.roleService.getAll();
  }

  @HasPermission(permission.ADMIN.CREATE_ROLE)
  @UseGuards(SecurityGuard)
  @Post('/')
  @HttpCode(201)
  async create(@Body() roleDto: RoleDto): Promise<void> {
    await this.roleService.create(roleDto);
  }
}
