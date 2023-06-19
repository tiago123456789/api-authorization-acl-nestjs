import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import provider from 'src/common/configs/provider';
import { EncrypterInterface } from 'src/common/adapters/encrypter.interface';
import { AuthTokenInterface } from 'src/common/adapters/auth-token.interface';
import { MailerInterface } from 'src/common/adapters/mailer.interface';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { UserPermission } from '../entities/user-permission.entity';
import { CredentialAuthDto } from '../dtos/credential-auth.dto';
import { Permission } from '../entities/permission.entity';
import { UserPermissionDto } from '../dtos/user-permission.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @Inject(provider.ENCRYPTER) private readonly encrypter: EncrypterInterface,
    @Inject(provider.AUTH_TOKEN) private readonly authToken: AuthTokenInterface,
    @Inject(provider.MAILER) private readonly mailer: MailerInterface,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    @InjectConnection() private connection: Connection,
  ) {}

  async applyPermissionToUser(userPermission: UserPermissionDto) {
    const [user, permission, userPermissionReturned] = await Promise.all([
      this.findById(userPermission.userId),
      this.permissionService.findById(userPermission.permissionId),
      this.userPermissionRepository.findOne({
        where: {
          user: {
            id: userPermission.userId,
          },
          permission: {
            id: userPermission.permissionId,
          },
        },
      }),
    ]);

    if (userPermissionReturned) {
      return;
    }

    return this.repository
      .createQueryBuilder()
      .insert()
      .into(UserPermission)
      .values([
        {
          user,
          permission,
        },
      ])
      .execute();
  }

  async removePermissionToUser(userPermission: UserPermissionDto) {
    const userPermissionReturned = await this.userPermissionRepository.findOne({
      where: {
        user: {
          id: userPermission.userId,
        },
        permission: {
          id: userPermission.permissionId,
        },
      },
    });

    if (!userPermissionReturned) {
      throw new NotFoundException(
        "User not exist or user don't have that permission",
      );
    }

    return this.userPermissionRepository.delete({
      user: {
        id: userPermission.userId,
      },
      permission: {
        id: userPermission.permissionId,
      },
    });
  }

  async getAll(): Promise<UserDto[]> {
    const registers: User[] = await this.repository.find();
    return registers.map((item) => {
      const userDto = new UserDto();
      userDto.id = item.getId();
      userDto.name = item.getName();
      userDto.email = item.getEmail();
      userDto.roleId = item.getRole().getId();
      return userDto;
    });
  }

  async findById(id: number): Promise<UserDto> {
    const register: User = await this.repository.findOne({
      where: { id },
    });

    if (!register) {
      throw new NotFoundException('User not found');
    }

    return {
      id: register.getId(),
      email: register.getEmail(),
      password: null,
      name: register.getName(),
      roleId: register.getRole().getId(),
    };
  }

  async register(data: UserDto): Promise<void> {
    const [role, hasUserUsingEmail, permissions] = await Promise.all([
      this.roleService.findById(data.roleId),
      this.repository.findOne({
        where: {
          email: data.email,
        },
      }),
      this.permissionService.getAllByRoleId(data.roleId),
    ]);

    if (hasUserUsingEmail) {
      throw new HttpException('Try another email!', 409);
    }

    data.password = await this.encrypter.getHash(data.password);
    const user: User = new User();
    user.setName(data.name);
    user.setEmail(data.email);
    user.setPassword(data.password);
    user.setRole(role);

    await this.connection.transaction(async (manager) => {
      await manager.getRepository(User).insert(user);
      const usersPermissionsToSave = [];
      for (let index = 0; index < permissions.length; index += 1) {
        const userPermission: UserPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermission(permissions[index]);
        usersPermissionsToSave.push(userPermission);
      }

      if (usersPermissionsToSave.length > 0) {
        await manager
          .createQueryBuilder()
          .insert()
          .into(UserPermission)
          .values(usersPermissionsToSave)
          .execute();
      }
    });

    await this.mailer.send({
      subject: 'Welcome to api crud user',
      from: process.env.EMAIL_FROM,
      to: data.email,
      template: 'welcome.hbs',
      context: {
        name: data.name,
      },
    });
  }

  async authenticate(credential: CredentialAuthDto) {
    const userByEmail = await this.repository.findOne({
      where: {
        email: credential.email,
      },
    });

    if (!userByEmail) {
      throw new HttpException('Email or password is invalid!', 400);
    }

    const isValidPassword = await this.encrypter.isValid(
      userByEmail.getPassword(),
      credential.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Email or password is invalid!', 400);
    }

    const userPermissions = await this.userPermissionRepository.find({
      where: {
        user: {
          id: userByEmail.getId(),
        },
      },
    });

    const permissionsIds = userPermissions.map((item) =>
      item.getPermission().getId(),
    );

    const permissions = await this.permissionService.findByIds(permissionsIds);
    return this.authToken.get({
      email: credential.email,
      id: userByEmail.getId(),
      role: userByEmail.getRole().getName(),
      permissions: permissions.map((item: Permission) => item.getName()),
    });
  }
}
