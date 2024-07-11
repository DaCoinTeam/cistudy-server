import { Resolver, Query, Args } from "@nestjs/graphql"
import { AccountsService } from "./accounts.service"
import { FindManyFollowersInputData, FindManyAccountReviewsInputData, FindManyAccountsInputData, FindOneAccountInputData, FindManyAccountReportsInputData, FindManyUnverifiedCourseInputData } from "./accounts.input"
import { AccountMySqlEntity } from "@database"
import { FindManyAccountReportsOutput, FindManyAccountReviewsOutputData, FindManyAccountsOutput, FindManyUnverifiedCourseOutput } from "./accounts.output"
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
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyAccountReportsOutput)
    async findManyAccountReports(@Args("data") data: FindManyAccountReportsInputData, @AccountId() accountId: string) {
        return await this.accountsService.findManyAccountReports({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyUnverifiedCourseOutput)
    async findManyUnverifiedCourses(@Args("data") data: FindManyUnverifiedCourseInputData, @AccountId() accountId: string) {
        return await this.accountsService.findManyUnverifiedCourse({ accountId, data })
    }
}

