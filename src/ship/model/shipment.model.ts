import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConsignmentSchema } from '../schema/participant.schema';
import {
  InsuranceTypeEnum,
  ModeOfShippingEnum,
  PackageTypeEnum,
  ShipmentStatusEnum,
  ShipmentTypeEnum,
  shippingCategoryEnum
} from '../enum/ship.enum';
import mongoose from 'mongoose';
import { PackageDimensionsSchema } from '../schema/packageDimensions.schema';
import { dbSchemaOptions } from 'src/utils/database/schema.config';

@Schema(dbSchemaOptions)
export class Shipment {
  @Prop({
    type: ConsignmentSchema,
  })
  sender: ConsignmentSchema;

  @Prop({
    type: ConsignmentSchema,
  })
  receiver: ConsignmentSchema;

  @Prop()
  quantity: number;

  @Prop({ enum: Object.values(ModeOfShippingEnum) })
  modeOfShipping: ModeOfShippingEnum;

  @Prop({ enum: Object.values(InsuranceTypeEnum), type: String })
  insuranceType: InsuranceTypeEnum;

  @Prop({enum:Object.values(shippingCategoryEnum)})
  shippingCategory:shippingCategoryEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  packageImage: string;

  @Prop()
  packageName: string;

  @Prop({ type: PackageDimensionsSchema })
  packageDimensions: PackageDimensionsSchema;

  @Prop({ enum: Object.values(PackageTypeEnum) })
  packageType: PackageTypeEnum;

  @Prop()
  packageWeight: number;

  @Prop({ type: Date })
  shipmentDate: Date;

  @Prop({ type: Date })
  deliveryDate: Date;

  @Prop({})
  expressDelivery: boolean;

  @Prop()
  additionalInformation: string;
  
  @Prop({
    ref: 'User',
    type:mongoose.Schema.Types.ObjectId
  })
  user: string;

  @Prop()
  transactionReference: string;

  @Prop()
  status: string;

  @Prop({ enum: Object.values(ShipmentStatusEnum) })
  shipmentStatus: ShipmentStatusEnum;

  @Prop({enum:Object.values(ShipmentTypeEnum)})
  shipmentType:ShipmentTypeEnum;

  @Prop()
  shipmentId: string;

  @Prop()
  shipmentCostTotal:number;

  @Prop({})
  pickUpByNitrals:boolean;
  
  @Prop({})
  dropOffByYou:boolean;
  
  @Prop({type:Date})
  pickUpDropOffDate:Date;
}

export type shipmentDoc = mongoose.Document & Shipment;
export const shipmentModel = SchemaFactory.createForClass(Shipment);