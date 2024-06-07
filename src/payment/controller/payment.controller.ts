import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { PaymentService } from '../services/remita.service';
import { WalletService } from 'src/wallet/service/wallet.service';
import { TransactionLogService } from 'src/transactionlog/service/transactionlog.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly paymentService: PaymentService,
    private readonly walletService: WalletService,
    private readonly transactionLogService: TransactionLogService

  ) {}

  @Post('remita')
  async handleRemitaWebhook(@Body() body, @Req() req, @Res() res) {
    console.log('Received webhook:', body);
    
    try {
      // Verify webhook payload (e.g., using a signature or secret if provided by Remita)
      const { transactionReference, status } = body;

      // Update transaction status in your database
      await this.transactionLogService.updateTransactionStatus(transactionReference, status);

      // Perform additional actions based on the status (e.g., update order status, notify user, etc.)
      if (status === 'SUCCESSFUL') {
        const transaction = await this.transactionLogService.findTransactionByReference(transactionReference);
        if (transaction) {
          if (transaction.transactionType === 'walletFunding') {
            await this.walletService.fundWallet(transaction.userId, transaction.amount);
          } else if (transaction.transactionType === 'shipmentPayment') {
            await this.paymentService.handleShipmentPayment(transaction.userId, transactionReference, transaction.amount);
          }
        }
      }

      res.status(HttpStatus.OK).send();
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
