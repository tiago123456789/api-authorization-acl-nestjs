import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleControllerController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { UserPermissionController } from './controllers/user-permission.controller';
import { UserPermission } from './entities/user-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, UserPermission]),
    CommonModule,
  ],
  controllers: [
    UserController,
    RoleControllerController,
    PermissionController,
    UserPermissionController,
  ],
  providers: [UserService, RoleService, PermissionService],
})
export class UserModule {}
