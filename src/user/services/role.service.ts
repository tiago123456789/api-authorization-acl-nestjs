import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleDto } from '../dtos/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {}

  async findById(id): Promise<Role> {
    const role = await this.repository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  getAll(): Promise<Role[]> {
    return this.repository.find({ where: {} });
  }

  create(roleDto: RoleDto) {
    roleDto.name = roleDto.name.toUpperCase().replace(/\s/, '_');
    return this.repository.insert(roleDto);
  }
}
