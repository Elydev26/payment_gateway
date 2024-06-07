import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ShipmentService } from '../service/shipment.service';
import { CreateShipmentDto, PackageSummaryType } from '../Dto/shipment.dto';
import { createShipmentValidator } from '../validator/shipment.validator';
import { Public } from 'src/utils/decorators/routePrivacy.decorator';
import { ApiResponse } from 'src/utils/common/interface/apiResponse.interface';
import { TokenDataDecorator } from 'src/utils/decorators/tokenData.decorator';
import { ObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import { UserTokenDto } from 'src/app/token/dto/token.dto';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post('book-or-instant-ship/create')
  @Public()
  //@UseGuards(CreateShipmentGuard)
  async bookOrInstantShip(
    @Body(new ObjectValidationPipe(createShipmentValidator))
    createShipmentDto: CreateShipmentDto,
    @TokenDataDecorator() tokenData: UserTokenDto,
  ): Promise<ApiResponse<PackageSummaryType>> {
    const shipment = await this.shipmentService.bookShipmentOrInstantShip(
      createShipmentDto,
      tokenData,
    );
    // Extract receiver and sender details
    const {
      receiver,
      sender,
      packageName,
      packageType,
      modeOfShipping,
      insuranceType,
      packageDimensions,
      shippingCategory,
      pickUpByNitrals,
      dropOffByYou,
      pickUpDropOffDate,
      shipmentId,
    } = shipment;
    const receiverDetails = {
      fullName: receiver.name,
      phoneNumber: receiver.phoneNumber,
    };
    const senderDetails = {
      fullName: sender.name,
      phoneNumber: sender.phoneNumber,
    };
    // Calculate price (dummy values for now, will implement actual logic)
    const priceSummary = {
      subTotal: 0,
      pickUpDropOff: 0,
      insurance: 0,
      discount: 0,
      grandTotal: 1000,
    };

    // Construct the response object
    const response: ApiResponse<PackageSummaryType> = {
      status: 'success',
      data: {
        reciever: receiverDetails,
        sender: senderDetails,
        origin: sender.state,
        destination: receiver.address,
        packageName,
        packageType,
        modeOfShipping,
        insuranceType: insuranceType ?? null,
        packageDimensions,
        shippingCategory,
        pickUpByNitrals,
        dropOffByYou,
        pickUpDropOffDate,
        shipmentDate: undefined,
        distance: null,
        shipmentId,
        priceSummary,
      },
    };

    return response;
  }
  
  @Get('get-all-shipment')
  @Public()
  async getAllShipment(){
    return await this.shipmentService.getAllShipment();
  }
}
