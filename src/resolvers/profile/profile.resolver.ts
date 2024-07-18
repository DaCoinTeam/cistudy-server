import { Resolver, Query, Args } from "@nestjs/graphql"
import { ProfileService } from "./profile.service"
import { FindManyEnrolledCoursesInputData, FindManySelfCreatedCoursesInputData, FindManyTransactionsInputData } from "./profile.input"
import { AuthInterceptor, JwtAuthGuard, AccountId } from "../shared"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import {
    FindManyEnrolledCoursesOutput,
    FindManySelfCreatedCoursesOutput,
    FindManyTransactionsOutput,

} from "./profile.output"

@Resolver()
export class ProfileResolver {
    constructor(private readonly profileService: ProfileService) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManySelfCreatedCoursesOutput)
    async findManySelfCreatedCourses(
        @AccountId() accountId: string,
        @Args("data") data: FindManySelfCreatedCoursesInputData,
    ) {
        return this.profileService.findManySelfCreatedCourses({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyEnrolledCoursesOutput)
    async findManyEnrolledCourses(
        @AccountId() accountId: string,
        @Args("data") data: FindManyEnrolledCoursesInputData,
    ) {
        return this.profileService.findManyEnrolledCourses({ accountId, data })
    }

    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(AuthInterceptor)
    // @Query(() => FindManySubmittedReportsOutput)
    // async findManySubmittedReports(@Args("data") data: FindManySubmittedReportsInputData, @AccountId() accountId: string) {
    //     return await this.profileService.findManySubmittedReports({ accountId, data })
    // }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyTransactionsOutput)
    async findManyTransactions(
        @AccountId() accountId: string,
        @Args("data") data: FindManyTransactionsInputData,
    ) {
        return this.profileService.findManyTransactions({ accountId, data })
    }
}
