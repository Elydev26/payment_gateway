import { Injectable } from '@nestjs/common';
import { Wallet } from '../model/wallet.model';
import { WalletService } from '../service/wallet.service';
import { UserService } from 'src/users/service/user.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from 'src/utils/enums/event.enum';
import { CreateWalletDto } from '../dto/wallet.dto';

@Injectable()
export class CreateUserWalletListener {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}
  
  @OnEvent(EventEnum.CreateUserWalletEvent)
  async handleCreateUserWalletEvent(payload:CreateWalletDto){
    const {user} = payload;
   const userWallet = await this.walletService.createWallet(user);
    if(userWallet)
    await this.userService.updateUser(user,{wallet:userWallet.id});
    return;
  }
}
