export class TransactionLogDto {
  userId: string;
  transactionReference: string;
  status: string;
  amount: number;
  userName?: string;
  transactionType: string;
}

export class UpdateLogStatusDto {
  logId: string;
  transactionReference: string;
  status: string;
  userName: string;
  transactionType: string;;
}
