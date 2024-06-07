import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/utils/database/db.service';
import { User, UserDoc } from '../model/user.model';
import { CreateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/utils/common/interface/apiResponse.interface';

@Injectable()
export class UserService extends BaseService<UserDoc, ''> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDoc>,
  ) {
    super(userModel);
  }

  async createuser(createUserDto: CreateUserDto): Promise<UserDoc> {
    const user = await this.userModel.create({
      ...createUserDto,
    });
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      userData,
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('user not found');
    return updatedUser;
  }

  async getUserById(userId: string): Promise<ApiResponse> {
    const user = (await this.findByIdOrErrorOut(userId)).populate('wallet');
    return {
      status: 'success',
      data: user,
    };
  }

  findByEmail(email: string): Promise<UserDoc> {
    const user = this.userModel.findOne({ email }).select('-refreshToken');
    if (!user) {
      throw new BadRequestException('user email does not exist');
    }
    return user;
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.findByIdAndUpdate(userId, { refreshToken });
  }
}
