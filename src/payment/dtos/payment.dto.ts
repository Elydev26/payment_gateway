
enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

enum TransactonTypeEnum {
  walletFunding = 'WalletFunding',
  shipmentPayment = 'shipmentPayment',
}

export class WebhookPaymentStatusDto {
  userId: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
}


export class InitiatePaymentDto {
  amount: number;
  transactionType:TransactonTypeEnum
}

export class VerifyPaymentDto {
  transactionReference: string;
  otp: string;
}

