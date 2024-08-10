import {
    AccountMySqlEntity,
    CartCourseMySqlEntity,
    CartMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    NotificationMySqlEntity,
    OrderCourseMySqlEntity,
    OrderMySqlEntity,
    RoleMySqlEntity,
    TransactionMongoEntity,
    TransactionMongoEntitySchema,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

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
            RoleMySqlEntity,
            EnrolledInfoMySqlEntity,
            NotificationMySqlEntity
        ]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}
