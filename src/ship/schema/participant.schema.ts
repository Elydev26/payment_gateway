import { Prop, Schema } from '@nestjs/mongoose';
import { dbSchemaOptions } from 'src/utils/database/schema.config';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { LocalGovernmentsEnum } from 'src/utils/enums/localgovernmentEnums/index.enum';
import { StateEnum } from 'src/utils/enums/stateEnums/index.enum';
import { PhoneNumberSchema } from 'src/utils/schema/phoneNumber.schema';

@Schema(dbSchemaOptions)
export class ConsignmentSchema {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({})
  phoneNumber:string;

  @Prop({enum:Object.values(CountryEnum)})
  country: CountryEnum;

  @Prop({enum:Object.values(StateEnum)})
  state: StateEnum;

  @Prop({enum:Object.values(LocalGovernmentsEnum)})
  localGovernment: LocalGovernmentsEnum;

  @Prop()
  address: string;
}
