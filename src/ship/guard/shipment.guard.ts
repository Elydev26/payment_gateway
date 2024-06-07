import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateShipmentDto } from '../Dto/shipment.dto';
import { ShipmentTypeEnum } from '../enum/ship.enum';
import { UserTokenDto } from 'src/app/token/dto/token.dto';



export class CreateShipmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const tokenData: UserTokenDto = response.locals.tokenData;
    const createShipmentDto = request.body as CreateShipmentDto;
    if (
      createShipmentDto.shipmentType === ShipmentTypeEnum.BookLater &&
      !tokenData
    )
      throw new UnauthorizedException(
        'Login to your account to book a shipment for later',
      );
      return true;
  }
}
