import {
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    CourseMySqlEntity,
    FollowMySqlEnitity,
    NotificationMySqlEntity,
    ReportAccountMySqlEntity,
    ReportCourseMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
    TransactionMySqlEntity,
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
            ReportPostCommentMySqlEntity,
            TransactionMySqlEntity,
            NotificationMySqlEntity
        ]),
    ],
    providers: [AccountsResolver, AccountsService],
})
export class AccountsModule {}
