import { Module } from "@nestjs/common";
import { ShipmentController } from "./controller/ship.controller";
import { ShipmentService } from "./service/shipment.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Shipment, shipmentModel } from "./model/shipment.model";

@Module({
    imports:[
        MongooseModule.forFeatureAsync([
            {
              name: Shipment.name,
              useFactory: () => {
                return shipmentModel;
              },
            },
          ]),
    ],
    controllers:[ShipmentController],
    providers:[ShipmentService],
    exports:[ShipmentService]
})
export class ShipmentModule {

}