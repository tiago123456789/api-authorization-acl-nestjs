import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  findByIds(ids: number[]) {
    return this.repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findById(id) {
    const permission = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

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
