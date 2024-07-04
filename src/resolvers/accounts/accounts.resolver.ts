import { Resolver, Query, Args } from "@nestjs/graphql"
import { AccountsService } from "./accounts.service"
import { FindManyCreatedCoursesInputData, FindManyFollowersInputData, FindManyAccountReviewsInputData, FindManyAccountsInputData, FindOneAccountInputData, FindManyReportsInputData } from "./accounts.input"
import { CourseMySqlEntity, AccountMySqlEntity } from "@database"
import { FindManyAccountReviewsOutputData, FindManyAccountsOutput, FindManyReportOutputData } from "./accounts.output"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"

@Resolver()
export class AccountsResolver {
    constructor(private readonly accountsService: AccountsService) { }

    @Query(() => AccountMySqlEntity)
    async findOneAccount(@Args("data") data: FindOneAccountInputData) {
        return this.accountsService.findOneAccount({ data })
    }

    @Query(() => [AccountMySqlEntity])
    async findManyFollowers(@Args("data") data: FindManyFollowersInputData) {
        return this.accountsService.findManyFollowers({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyAccountsOutput)
    async findManyAccounts(@AccountId() accountId: string, @Args("data") data: FindManyAccountsInputData) {
        return this.accountsService.findManyAccounts({ accountId, data })
    }

    @Query(() => FindManyAccountReviewsOutputData)
    async findManyAccountReviews(@Args("data") data: FindManyAccountReviewsInputData) {
        return await this.accountsService.findManyAccountReviews({ data })
    }

    @UseGuards(JwtAuthGuard)
    //@UseInterceptors(AuthInterceptor)
    @Query(() => FindManyReportOutputData)
    async findManyReports(@Args("data") data: FindManyReportsInputData, @AccountId() accountId: string) {
        return await this.accountsService.findManyReports({ accountId, data })
    }
}

