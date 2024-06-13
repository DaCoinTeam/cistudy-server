import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    CartCourseMySqlEntity,
    CourseMySqlEntity,
    OrderMySqlEntity,
    AccountMySqlEntity,
} from "@database"

import { CartResolver } from "./cart.resolver"
import { CartService } from "./cart.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            CartMySqlEntity,
            CartCourseMySqlEntity,
            CourseMySqlEntity,
            OrderMySqlEntity
        ]),
    ],
    providers: [CartResolver, CartService],
})
export class CartModule {}
