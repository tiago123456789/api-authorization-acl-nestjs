import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'users_permissions' })
export class UserPermission {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Permission, (permission) => permission.id)
  @JoinColumn({ name: 'permission_id' })
  public permission: Permission;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  getId(): number {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }

  getPermission(): Permission {
    return this.permission;
  }

  setPermission(permission: Permission) {
    this.permission = permission;
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }
}
