import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { NotificationService } from '../notification/notification.service';
import { WalletService } from 'src/wallet/service/wallet.service';
import { ShipmentService } from 'src/ship/service/shipment.service';
import { TransactionLog } from 'src/transactionlog/models/transaction.model';
import { TransactionLogDto } from 'src/transactionlog/dtos/transactionLOg.dto';
import { TransactionLogService } from 'src/transactionlog/service/transactionlog.service';
import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';

@Injectable()
export class PaymentService {

  constructor(
    private readonly config: ConfigService,
    private readonly walletService: WalletService,
    private readonly transactionLogService: TransactionLogService,
    private readonly shipmentService: ShipmentService,
    // private readonly notificationService: NotificationService,
  ) {
  }

  // async initiatePayment(userId: string, amount: number, transactionType: string): Promise<any> {
  //   try {
  //     const transactionReference = this.generateTransactionReference();
  //     const log: TransactionLogDto = {
  //       userId,
  //       transactionReference,
  //       amount,
  //       status: 'INITIATED',
  //       transactionType,
  //     };
  //     await this.transactionLogService.createLog(log);

  //     const response = await axios.post(`${this.config.get<string>(EnvConfigEnum.REMITA_BASE_URL)}/initiate`, {
  //       userId,
  //       amount,
  //       transactionReference,
  //       apiKey: this.config.get<string>(EnvConfigEnum.REMITA_API_KEY),
  //     });

  //     if (response.data.success) {
  //       // Send OTP
  //       const otpResponse = await axios.post(`${this.config.get<string>(EnvConfigEnum.REMITA_BASE_URL)}/send-otp`, {
  //         userId,
  //         transactionReference,
  //         apiKey: this.config.get<string>(EnvConfigEnum.REMITA_API_KEY),
  //       });

  //       if (otpResponse.data.success) {
  //         return {
  //           ...response.data,
  //           transactionReference,
  //           message: 'Payment initiated successfully. OTP sent.',
  //         };
  //       } else {
  //         await this.transactionLogService.updateTransactionStatus(transactionReference, 'FAILED');
  //         throw new HttpException('Failed to send OTP', HttpStatus.BAD_REQUEST);
  //       }
  //     } else {
  //       await this.transactionLogService.updateTransactionStatus(transactionReference, 'FAILED');
  //       throw new HttpException('Payment initiation failed', HttpStatus.BAD_REQUEST);
  //     }
  //   } catch (error) {
  //     throw new HttpException(
  //       error.response ? error.response.data : 'An error occurred',
  //       error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async initiatePayment(userId: string, amount: number): Promise<any> {
    try {
      const response = await axios.post(`${this.config.get<string>(EnvConfigEnum.REMITA_BASE_URL)}/initiate`, {
        userId,
        amount,
        // transactionReference,
        apiKey: this.config.get<string>(EnvConfigEnum.REMITA_API_KEY),
      });

      if (response.data.success) {
        const transactionId = response.data.transactionId;
        const otpResponse = await this.sendOtp(userId, transactionId);

        if (otpResponse.success) {
          return {
            ...response.data,
            message: 'Payment initiated and OTP sent successfully',
          };
        } else {
          throw new HttpException('OTP sending failed', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Payment initiation failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data : 'An error occurred',
        error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async sendOtp(userId: string, transactionId: string): Promise<any> {
        const otpResponse = await axios.post(`${this.config.get<string>(EnvConfigEnum.REMITA_BASE_URL)}/send-otp`, {
          userId,
          // transactionReference,
          apiKey: this.config.get<string>(EnvConfigEnum.REMITA_API_KEY),
        });

    return otpResponse.data;
  }
  async verifyPayment(userId: string, transactionReference: string, otp: string): Promise<any> {
    try {
      const transaction = await this.transactionLogService.findOne(transactionReference);

      if (!transaction || transaction.status !== 'INITIATED') {
        throw new HttpException('Invalid transaction', HttpStatus.BAD_REQUEST);
      }

      const response = await axios.post(`${this.config.get<string>(EnvConfigEnum.REMITA_BASE_URL)}/verify`, {
        userId,
        transactionReference,
        otp,
        apiKey: this.config.get<string>(EnvConfigEnum.REMITA_API_KEY)
      });

      if (response.data.success) {
        await this.transactionLogService.update(transactionReference , { status: 'VERIFIED' });

        if (transaction.transactionType === 'walletFunding') {
          await this.walletService.fundWallet(userId, transaction.amount);
        } else if (transaction.transactionType === 'shipmentPayment') {
          await this.handleShipmentPayment(userId, transactionReference, transaction.amount);
        }

        return response.data;
      } else {
        await this.transactionLogService.update( transactionReference , { status: 'FAILED' });
        throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        error.response ? error.response.data : 'An error occurred',
        error.response ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

   generateTransactionReference(): string {
    const prefix = 'TRX';
    const timestamp = Date.now().toString();
    const randomChars = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${randomChars}`;
  }

 async handleShipmentPayment(userId: string, transactionReference: string, amount: number): Promise<void> {
    try {
      await this.shipmentService.updateShipmentStatus(transactionReference, 'PAID');

      // await this.notificationService.sendNotification(userId, 'Your shipment payment has been successfully processed.');

      console.log(`Shipment payment processed for user: ${userId}, transactionReference: ${transactionReference}, amount: ${amount}`);
      
    } catch (error) {
      throw new HttpException(`Failed to handle shipment payment: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async handlePaymentStatus(payload: any, secretKey: string): Promise<any> {
    // Verify the secret key
    if (secretKey !== process.env.REMITA_SECRET_KEY) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { userId, transactionId, status, amount } = payload;

    if (status === 'SUCCESS') {
      await this.walletService.updateBalance(userId, amount);
    } else {
      throw new HttpException('Payment failed', HttpStatus.BAD_REQUEST);
    }

    return { message: 'Payment status processed' };
  }
}
