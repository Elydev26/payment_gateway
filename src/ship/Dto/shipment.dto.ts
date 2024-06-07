import { StateEnum } from 'src/utils/enums/stateEnums/index.enum';
import {
  ModeOfShippingEnum,
  InsuranceTypeEnum,
  PackageTypeEnum,
  ShipmentStatusEnum,
  ShipmentTypeEnum,
  shippingCategoryEnum,
} from '../enum/ship.enum';
import { PackageDimensionsSchema } from '../schema/packageDimensions.schema';
import { ConsignmentSchema } from '../schema/participant.schema';
export class CreateShipmentDto {
  sender: ConsignmentSchema;
  receiver: ConsignmentSchema;
  quantity: number;
  modeOfShipping: ModeOfShippingEnum;
  insuranceType: InsuranceTypeEnum;
  packageName: string;
  packageDimensions: PackageDimensionsSchema;
  packageType: PackageTypeEnum;
  packageWeight: number; 
  packageImage: string;
  shipmentDate: Date;
  deliveryDate: Date;
  expressDelivery: boolean;
  additionalInformation: string;
  shipmentType: ShipmentTypeEnum;
  shippingCategory:shippingCategoryEnum;
  shipmentStatus: ShipmentStatusEnum;
  shipmentId?: string;
  user?: string;
  shipmentTotal?: number;
  pickUpByNitrals: boolean;
  dropOffByYou: boolean;
  pickUpDropOffDate: Date;
}

export class PackageSummary {
  receiver: Consignor;
  sender: Consignor;
  origin: string;
  destination: string;
  packageName: string;
  packageType: PackageTypeEnum;
  modeOfShipping: ModeOfShippingEnum;
  insuranceType: InsuranceTypeEnum;
  subTotal: number;
  discount: number;
  insurance: number;
  grandTotal: number;
}

export class Consignor {
  fullName: string;
  phoneNumber: string;
}

export type PackageSummaryType = {
 reciever:Consignor;
 sender:Consignor;
 origin:StateEnum;
 destination:string;
 packageName:string;
 packageType:string;
 packageDimensions:PackageDimensionsSchema;
 shippingCategory:shippingCategoryEnum;
 modeOfShipping:ModeOfShippingEnum;
 insuranceType:InsuranceTypeEnum;
 pickUpByNitrals: boolean;
 dropOffByYou: boolean;
 pickUpDropOffDate:Date;
 shipmentDate:Date;
 distance:number;
 shipmentId:string;
 priceSummary:PriceSummary
}

export type PriceSummary = {
subTotal:number;
pickUpDropOff:number;
insurance:number;
discount:number;
grandTotal:number;
}