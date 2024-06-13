import { Module } from "@nestjs/common"
import { AuthResolver } from "./auth.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    AccountMySqlEntity,
} from "@database"
import { AuthService } from "./auth.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            CartMySqlEntity
        ]),
    ],
    providers: [AuthResolver, AuthService],
})
export class AuthModule {}
