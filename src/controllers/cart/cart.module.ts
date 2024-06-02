import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    CartCourseMySqlEntity,
    CourseMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
    OrderMySqlEntity,
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
            OrderMySqlEntity
        ]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}
