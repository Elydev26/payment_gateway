import { Controller, Get, Query } from '@nestjs/common';
import { LogisticService } from '../services/logistic.service';

@Controller('logistics')
export class LogisticController {
    constructor(private readonly logisticsService: LogisticService) {}

    @Get('location')
    async getUserLocation() {
        const location = await this.logisticsService.getGeolocation();
        return location;
    }

    @Get('distance')
    async getDistance(
        @Query('origin') origin: string,
        @Query('destination') destination: string
    ) {
        const distanceData = await this.logisticsService.getDistanceMatrix(origin, destination);
        return distanceData;
    }
}
