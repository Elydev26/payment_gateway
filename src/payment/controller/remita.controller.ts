import { Controller, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../services/remita.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(
    @Body('userId') userId: string,
    @Body('amount') amount: number,
    @Body('transactionType') transactionType: string
  ) {
    try {
      const result = await this.paymentService.initiatePayment(userId, amount
        // transactionType
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data : 'An error occurred during payment initiation',
        error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify')
  async verifyPayment(
    @Body('userId') userId: string,
    @Body('transactionReference') transactionReference: string,
    @Body('otp') otp: string
  ) {
    try {
      const result = await this.paymentService.verifyPayment(userId, transactionReference, otp);
      return result;
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data : 'An error occurred during payment verification',
        error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
