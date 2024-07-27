import {
    AccountMySqlEntity,
    CartCourseMySqlEntity,
    CartMySqlEntity,
    CourseMySqlEntity,
    OrderMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

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
