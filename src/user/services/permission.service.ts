import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from './role.service';
import { PermissionDto } from '../dtos/permission.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
    private readonly roleServie: RoleService,
  ) {}

  getAllByRoleId(roleId: number): Promise<Permission[]> {
    return this.repository.find({
      where: {
        role: {
          id: roleId,
        },
      },
    });
  }

  async create(roleId: number, permissionDto: PermissionDto) {
    const role: Role = await this.roleServie.findById(roleId);
    const permission = new Permission();

    permission.setRole(role);
    permission.setName(permissionDto.name.toUpperCase().replace(/\s/, '_'));
    await this.repository.insert(permission);
  }
}
