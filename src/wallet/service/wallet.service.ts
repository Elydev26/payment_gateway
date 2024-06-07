import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, walletDoc } from '../model/wallet.model';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/utils/common/interface/apiResponse.interface';
import { UserTokenDto } from 'src/app/token/dto/token.dto';
import { UserService } from 'src/users/service/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<walletDoc>,
    private readonly userService: UserService
  ) {}

  async createWallet(user: string): Promise<walletDoc> {
    const walletExist = await this.walletModel.findOne({ user });
    if (walletExist) return;
    const createdWallet = await this.walletModel.create({ user });
    return createdWallet;
  }

  async getUserWallet(
    tokenData: UserTokenDto,
  ): Promise<ApiResponse<walletDoc>> {
    const wallet = await this.walletModel.findOne({ user: tokenData.id });
    if (!wallet) throw new NotFoundException('user does not have a wallet');
    return {
      status: 'sucess',
      data: wallet,
    };
  }

  async fundWallet(userId: string, amount: number) {
    const user = await (await this.userService.findById(userId)).populate('wallet');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wallet = await this.walletModel.findById(user.wallet);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    wallet.balance += amount;
    await wallet.save();
  }

  async getWallet(userId: string): Promise<walletDoc> {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }
  async updateBalance(userId: string, amount: number): Promise<walletDoc> {
    const wallet = await this.getWallet(userId);
    wallet.balance += amount;
    return wallet.save();
  }

}
