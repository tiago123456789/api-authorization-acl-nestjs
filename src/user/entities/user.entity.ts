import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 70 })
  public name: string;

  @Column({ type: 'varchar', length: 150 })
  public email: string;

  @Column({ type: 'varchar', length: 255 })
  public password: string;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  @JoinColumn({ name: 'role_id' })
  public role: Role;

  getId(): number {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getRole(): Role {
    return this.role;
  }

  setRole(role: Role) {
    this.role = role;
  }
}
