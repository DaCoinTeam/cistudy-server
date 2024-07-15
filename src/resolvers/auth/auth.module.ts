import { Module } from "@nestjs/common"
import { AuthResolver } from "./auth.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CartMySqlEntity,
    AccountMySqlEntity,
    RoleMySqlEntity,
    CourseMySqlEntity,
    PostMySqlEntity,
    CourseReviewMySqlEntity,
    AccountReviewMySqlEntity,
    EnrolledInfoMySqlEntity,
} from "@database"
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
