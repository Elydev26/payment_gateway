import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { dbSchemaOptions } from 'src/utils/database/schema.config';

const ObjectId = mongoose.Schema.Types.ObjectId;
@Schema(dbSchemaOptions)
export class TransactionLog extends Document {

    @Prop({type:ObjectId, ref:'User'})
    userId: string;
  
    @Prop()
    userName: string;

    @Prop()
    transactionReference: string;
  
    @Prop()
    amount: number;
  
    @Prop({ enum: ['INITIATED', 'VERIFIED', 'FAILED'] })
    status: string;
  
    @Prop({ enum: ['walletFunding', 'shipmentPayment'] })
    transactionType: string;
  
    @Prop({ default: Date.now })
    createdAt: Date;
}

export const TransactionLogSchema =
  SchemaFactory.createForClass(TransactionLog);
