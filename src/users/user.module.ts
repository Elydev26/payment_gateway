import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserModel } from "./model/user.model";
import { WalletModule } from "src/wallet/wallet.module";

@Module({
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService],
    imports:[
      forwardRef(() => WalletModule),
        MongooseModule.forFeatureAsync([
            {
              name: User.name,
              useFactory: () => {
                return UserModel;
              },
            },
          ]),
    ]
})
export class UserModule {

}