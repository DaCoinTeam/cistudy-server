import { Module } from "@nestjs/common"
import { AccountsResolver } from "./accounts.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    CourseMySqlEntity,
    FollowMySqlEnitity,
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostMySqlEntity,
    ReportPostCommentMySqlEntity,
} from "@database"
import { AccountsService } from "./accounts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountMySqlEntity,
            FollowMySqlEnitity,
            CourseMySqlEntity,
            AccountReviewMySqlEntity,
            ReportAccountMySqlEntity,
            ReportCourseMySqlEntity,
            ReportPostMySqlEntity,
            ReportPostCommentMySqlEntity
        ]),
    ],
    providers: [AccountsResolver, AccountsService],
})
export class AccountsModule {}
