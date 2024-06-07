import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionActionEnum } from '../dtos/transaction.dto';
import { TransactionLog } from '../models/transaction.model';
import { TransactionLogDto, UpdateLogStatusDto } from '../dtos/transactionLOg.dto';

@Injectable()
export class TransactionLogService {
  constructor(
    @InjectModel(TransactionLog.name)
    private transactionLogModel: Model<TransactionLog>,
  ) {}

  // async createLog(log: TransactionLogDto) {
  //   return await this.transactionLogModel.create(log);
  // }

  async getFundingLogByRef(ref: string) {
    return await this.transactionLogModel.findOne({
      transactionAction: TransactionActionEnum.WalletFunding,
      'transactionType.tx_ref': ref,
    });
  }
  // async createLog(log: TransactionLogDto): Promise<void> {
  //   try {
  //     await this.transactionLogModel.create(log);
  //   } catch (error) {
  //     throw new HttpException(`Failed to create transaction log: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async findOne(transactionReference: string): Promise<TransactionLog> {
  //   try {
  //     const transaction = await this.transactionLogModel.findOne({ transactionReference }).exec();
  //     if (!transaction) {
  //       throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
  //     }
  //     return transaction;
  //   } catch (error) {
  //     throw new HttpException(`Failed to find transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async update(transactionReference: string, updateData) {
  //   try {
  //     const result = await this.transactionLogModel.updateOne(
  //       { transactionReference },
  //       { $set: updateData },
  //     ).exec();
  //     if (!result) {
  //       throw new HttpException('Transaction not found or no changes made', HttpStatus.NOT_FOUND);
  //     }
  //   } catch (error) {
  //     throw new HttpException(`Failed to update transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createLog(log: TransactionLogDto): Promise<void> {
    try {
      await this.transactionLogModel.create(log);
    } catch (error) {
      throw new HttpException(`Failed to create transaction log: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(transactionReference: string): Promise<TransactionLog> {
    try {
      const transaction = await this.transactionLogModel.findOne({ transactionReference }).exec();
      if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }
      return transaction;
    } catch (error) {
      throw new HttpException(`Failed to find transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(transactionReference: string, updateData: Partial<TransactionLogDto>): Promise<void> {
    try {
      const result = await this.transactionLogModel.updateOne(
        { transactionReference },
        { $set: updateData },
      ).exec();
      if (!result) {
        throw new HttpException('Transaction not found or no changes made', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`Failed to update transaction: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findTransactionByReference(transactionReference: string): Promise<TransactionLog> {
    return this.transactionLogModel.findOne({ transactionReference });
  }
  async updateTransactionStatus(transactionReference: string, status: string): Promise<void> {
    await this.transactionLogModel.updateOne({ transactionReference }, { status });
  }
  // async updateLogStatus(update: UpdateLogStatusDto) {
  //   const updates = await this.transactionLogModel.findByIdAndUpdate(
  //     update.logId,
  //     {
  //       transactionStatus: update.transactionStatus,
  //       balanceAfterTransaction: update.balanceAfterTransaction,
  //     },
  //     { new: true },
  //   );
  //   return updates;
  // }

//   async search(filter: TransactionLogSearchDto) {
//     const { organizationId, startDate, endDate, limit, page } = filter;

//     const topLevelFilter = {};
//     organizationId
//       ? (topLevelFilter['organizationId'] = { $in: organizationId })
//       : null;
//     startDate
//       ? (topLevelFilter['createdAt'] = {
//           $gte: new Date(startDate),
//           $lte: new Date(
//             endDate.getTime() + -1000 * 60 * endDate.getTimezoneOffset(),
//           ),
//         })
//       : null;

//     // const searchTermFilter = [];

//     const count = await this.transactionLogModel.countDocuments({
//       ...topLevelFilter,
//       // $or: searchTermFilter,
//     });

//     const totalPages = Math.ceil(count / limit);
//     const currentPage = page;

//     const foundTransactionLogs = await this.transactionLogModel
//       .find({
//         ...topLevelFilter,
//         // $or: searchTermFilter,
//       })
//       .skip((page - 1) * limit)
//       .limit(limit);
//     return { count, totalPages, currentPage, foundTransactionLogs };
//   }
}
