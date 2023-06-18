import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { CredentialAuthDto } from '../dtos/credential-auth.dto';
import { SecurityGuard } from 'src/security/security.guard';
import { HasPermission } from 'src/security/has-permission.decorater';
import permission from 'src/common/types/permission';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HasPermission(permission.ADMIN.LIST_USER)
  @UseGuards(SecurityGuard)
  @Get()
  getAll(): Promise<UserDto[]> {
    return this.userService.getAll();
  }

  @HasPermission(permission.ADMIN.LIST_USER_BY_ID)
  @UseGuards(SecurityGuard)
  @Get('/:id')
  findById(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @HasPermission(permission.ADMIN.CREATE_USER)
  @UseGuards(SecurityGuard)
  @Post()
  @HttpCode(201)
  register(@Body() userDto: UserDto) {
    return this.userService.register(userDto);
  }

  @Post('/login')
  async authenticate(
    @Body() credentialAuthDto: CredentialAuthDto,
  ): Promise<{ [key: string]: any }> {
    const accessToken = await this.userService.authenticate(credentialAuthDto);
    return {
      accessToken,
    };
  }
}
