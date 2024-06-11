import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    CartCourseMySqlEntity,
    CourseMySqlEntity,
    OrderMySqlEntity,
    UserMySqlEntity,
} from "@database"

import { CartResolver } from "./cart.resolver"
import { CartService } from "./cart.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMySqlEntity,
            CartMySqlEntity,
            CartCourseMySqlEntity,
            CourseMySqlEntity,
            OrderMySqlEntity
        ]),
    ],
    providers: [CartResolver, CartService],
})
export class CartModule {}
