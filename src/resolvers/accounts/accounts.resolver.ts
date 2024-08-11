import { AccountMySqlEntity } from "@database"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { AccountId, AuthInterceptor, JwtAuthGuard } from "../shared"
import {
    FindManyAccountReportsInputData,
    FindManyAccountReviewsInputData,
    FindManyAccountsInputData,
    FindManyAdminTransactionsInputData,
    FindManyFollowersInputData,
    FindManyNotificationsInputData,
    FindManyPendingCourseInputData,
    FindOneAccountInputData,
    FindOneAdminAccountInputData,
} from "./accounts.input"
import {
    FindLatestConfigurationOutput,
    FindManyAccountReportsOutput,
    FindManyAccountReviewsOutputData,
    FindManyAccountsOutput,
    FindManyAdminTransactionsOutput,
    FindManyNotificationsOutput,
    FindManyPendingCourseOutput,
    FindOneAdminAccountOutput,
    GetAdminAnalyticsOutput,
} from "./accounts.output"
import { AccountsService } from "./accounts.service"

@Resolver()
export class AccountsResolver {
    constructor(private readonly accountsService: AccountsService) {}

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
  async findManyAccounts(
    @AccountId() accountId: string,
    @Args("data") data: FindManyAccountsInputData,
  ) {
      return this.accountsService.findManyAccounts({ accountId, data })
  }

  @Query(() => FindManyAccountReviewsOutputData)
  async findManyAccountReviews(
    @Args("data") data: FindManyAccountReviewsInputData,
  ) {
      return await this.accountsService.findManyAccountReviews({ data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyAccountReportsOutput)
  async findManyAccountReports(
    @Args("data") data: FindManyAccountReportsInputData,
    @AccountId() accountId: string,
  ) {
      return await this.accountsService.findManyAccountReports({
          accountId,
          data,
      })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyPendingCourseOutput)
  async findManyPendingCourses(
    @Args("data") data: FindManyPendingCourseInputData,
    @AccountId() accountId: string,
  ) {
      return await this.accountsService.findManyPendingCourse({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyAdminTransactionsOutput)
  async findManyAdminTransactions(
    @Args("data") data: FindManyAdminTransactionsInputData,
    @AccountId() accountId: string,
  ) {
      return await this.accountsService.findManyAdminTransactions({
          accountId,
          data,
      })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindManyNotificationsOutput)
  async findManyNotifications(
    @Args("data") data: FindManyNotificationsInputData,
    @AccountId() accountId: string,
  ) {
      return await this.accountsService.findManyNotifications({ accountId, data })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => GetAdminAnalyticsOutput)
  async getAdminAnalytics() {
      return await this.accountsService.getAdminAnalytics()
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindLatestConfigurationOutput)
  async findLatestConfiguration() {
      return await this.accountsService.findLatestConfiguration()
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  @Query(() => FindOneAdminAccountOutput)
  async findOneAdminAccount(
    @Args("data") data: FindOneAdminAccountInputData,
    @AccountId() accountId: string,
  ) {
      return await this.accountsService.findOneAdminAccount({
          data,
          accountId,
      })
  }
}
