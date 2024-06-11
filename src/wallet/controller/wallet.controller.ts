import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import {
  InitiatePaymentDto,
  VerifyPaymentDto,
} from 'src/payment/dtos/payment.dto';
import { PaymentService } from 'src/payment/services/remita.service';
import { TokenDataDecorator } from 'src/utils/decorators/tokenData.decorator';
import { UserTokenDto } from 'src/app/token/dto/token.dto';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentService: PaymentService,
  ) {}
  @Get('get-wallet-info')
  async getUserWallet(@TokenDataDecorator() tokenData: UserTokenDto) {
    return await this.walletService.getUserWallet(tokenData);
  }

  @Get(':userId')
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Patch(':userId/balance')
  updateBalance(
    @Param('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.updateBalance(userId, amount);
  }
  @Post(':userId/payment')
  initiatePayment(
    @Param('userId') userId: string,
    @Body() initiatePaymentDto: InitiatePaymentDto,
  ) {
    return this.paymentService.initiatePayment(
      userId,
      initiatePaymentDto.amount,
      initiatePaymentDto.transactionType,
    );
  }

  @Post(':userId/verify-payment')
  verifyPayment(
    @Param('userId') userId: string,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(
      userId,
      verifyPaymentDto.transactionReference,
      verifyPaymentDto.otp,
    );
  }
}
