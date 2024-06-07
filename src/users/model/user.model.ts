import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { dbSchemaOptions } from 'src/utils/database/schema.config';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';
import { UserRoleEnum } from 'src/utils/enums/userRole.enum';

@Schema(dbSchemaOptions)
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profilePicture: string;

  @Prop()
  facebookId?: string;

  @Prop()
  displayName?: string;

  @Prop({ enum: Object.values(UserRoleEnum) })
  userRole: UserRoleEnum;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({
    enum: Object.values(AccountStatusEnum),
    default: AccountStatusEnum.Active,
  })
  accountStatus: AccountStatusEnum;

  @Prop({
    ref: 'Wallet',
    type: mongoose.Schema.Types.ObjectId,
  })
  wallet: string; 
  // mongoose.Schema.Types.ObjectId;
}

export type UserDoc = User & mongoose.Document;
export const UserModel = SchemaFactory.createForClass(User);
