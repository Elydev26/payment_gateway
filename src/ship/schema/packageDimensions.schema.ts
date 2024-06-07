import { Prop } from '@nestjs/mongoose';

export class PackageDimensionsSchema {
  @Prop()
  length: number;

  @Prop()
  width: number;

  @Prop()
  height: number;
}
