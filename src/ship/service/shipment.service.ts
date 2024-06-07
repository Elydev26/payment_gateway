import { Injectable } from '@nestjs/common';
import { CreateShipmentDto, PackageSummaryType } from '../Dto/shipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shipment, shipmentDoc } from '../model/shipment.model';
import { Model } from 'mongoose';
import { ShipmentStatusEnum } from '../enum/ship.enum';
import { generateShipmentId } from 'src/utils/common/function/common.function';
import { UserTokenDto } from 'src/app/token/dto/token.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name)
    private readonly shipmentModel: Model<shipmentDoc>,
  ) {}

  async bookShipmentOrInstantShip(
    CreateShipmentDto: CreateShipmentDto,
    tokenData: UserTokenDto,
  ): Promise<shipmentDoc> {
    // Create and save shipment
    const shipment = new this.shipmentModel({
      ...CreateShipmentDto,
      shipmentCostTotal:1000,
      shipmentId: generateShipmentId(),
      user: tokenData?.id ?? null,
      shipmentStatus: ShipmentStatusEnum.Initiated,
    });
   return await shipment.save();
  }

  async getAllShipment(){
    return await this.shipmentModel.find({user:{$ne:null}})
  }

  async shipmentCalculator() {}

  async updateShipmentStatus(transactionReference: string, status: string) {
    try {
      const order = await this.shipmentModel.findOne({ transactionReference });

      if (!order) {
        throw new Error('Order not found');
      }

      order.status = status;
      await order.save();
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }
}
