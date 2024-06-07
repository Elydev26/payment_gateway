import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';
import { Public } from 'src/utils/decorators/routePrivacy.decorator';
import { ValidateId } from 'src/utils/pipes/validation.pipe';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Public()
  @Get('get-by-id/:id')
  async getUser(@Param('id', new ValidateId()) id: string) {
    return await this.userService.getUserById(id);
  }

}
