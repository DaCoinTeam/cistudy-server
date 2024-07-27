import {
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    CartMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    EnrolledInfoMySqlEntity,
    PostMySqlEntity,
    RoleMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthResolver } from "./auth.resolver"
import { AuthService } from "./auth.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            CartMySqlEntity,
            RoleMySqlEntity,
            CourseMySqlEntity,
            PostMySqlEntity,
            CourseReviewMySqlEntity,
            AccountReviewMySqlEntity,
            EnrolledInfoMySqlEntity
        ]),
    ],
    providers: [AuthResolver, AuthService],
})
export class AuthModule {}
