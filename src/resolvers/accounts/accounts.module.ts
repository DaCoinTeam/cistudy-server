import {
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    CourseMySqlEntity,
    FollowMySqlEnitity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
} from "@database"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AccountsResolver } from "./accounts.resolver"
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
