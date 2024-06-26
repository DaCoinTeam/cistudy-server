import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    CartCourseMySqlEntity,
    CourseMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
    OrderMySqlEntity,
    OrderCourseMySqlEntity,
    AccountMySqlEntity,
    RoleMySqlEntity,
} from "@database"

import { MongooseModule } from "@nestjs/mongoose"
import { CartController } from "./cart.controller"
import { CartService } from "./cart.service"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TransactionMongoEntity.name, schema: TransactionMongoEntitySchema }]),
        TypeOrmModule.forFeature([
            CartMySqlEntity,
            CartCourseMySqlEntity,
            CourseMySqlEntity,
            OrderMySqlEntity,
            OrderCourseMySqlEntity,
            AccountMySqlEntity,
            RoleMySqlEntity
        ]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}
