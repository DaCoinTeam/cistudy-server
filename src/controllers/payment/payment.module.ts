import { Module } from "@nestjs/common"
import { PaymentController } from "./payment.controller"
import { PaymentService } from "./payment.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountMySqlEntity, RoleMySqlEntity } from "@database"

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountMySqlEntity, RoleMySqlEntity])
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
