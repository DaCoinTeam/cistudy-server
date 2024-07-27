import { Module } from "@nestjs/common"
import { AccountsModule } from "./accounts"
import { AssetsModule } from "./assets"
import { AuthModule } from "./auth"
import { CartModule } from "./cart"
import { CoursesModule } from "./courses"
import { PaymentModule } from "./payment"
import { PostsModule } from "./posts"
import { ProfileModule } from "./profile"



@Module({
    imports: [
        AssetsModule,
        AuthModule,
        CoursesModule,
        PostsModule,
        ProfileModule,
        AccountsModule,
        CartModule,
        PaymentModule
    ],
    providers: []
})
export class ControllersModule {}
 