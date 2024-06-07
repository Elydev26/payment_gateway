import { Controller, Get } from '@nestjs/common';
import { GenericAPIsService } from '../services/genericAPIS.service';

@Controller('generic-apis')
export class GenericAPIsController {
  constructor(private readonly genericAPIsService: GenericAPIsService) {}

  @Get('all-enum')
  getAllEnumsValues() {
    return this.genericAPIsService.getAllEnumsValues();
  }
}
