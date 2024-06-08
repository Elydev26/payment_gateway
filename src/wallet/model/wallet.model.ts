import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { generateRandomNumber } from 'src/utils/common/function/common.function';
import { dbSchemaOptions } from 'src/utils/database/schema.config';

@Schema(dbSchemaOptions)
export class Wallet {
  @Prop({default:0})
  balance: number;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  user: string;

  @Prop({default: generateRandomNumber(10)})
  accountNo: number;
}

export type walletDoc = mongoose.Document & Wallet;
export const walletModel = SchemaFactory.createForClass(Wallet);
