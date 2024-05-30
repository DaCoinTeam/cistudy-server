import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    CartProductMySqlEntity,
    CourseMySqlEntity,
} from "@database"

import { CartResolver } from "./cart.resolver"
import { CartService } from "./cart.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CartMySqlEntity,
            CartProductMySqlEntity,
            CourseMySqlEntity
        ]),
    ],
    providers: [CartResolver, CartService],
})
export class CartModule {}
