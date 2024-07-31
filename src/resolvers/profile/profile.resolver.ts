import { UseGuards, UseInterceptors } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { AccountId, AuthInterceptor, JwtAuthGuard } from "../shared"
import { FindManyEnrolledCoursesInputData, FindManyReceivedNotificationsInputData, FindManySelfCreatedCoursesInputData, FindManyTransactionsInputData, FindOneCertificateInputData } from "./profile.input"
import {
    FindManyEnrolledCoursesOutput, FindManyReceivedNotificationsOutput,
    FindManySelfCreatedCoursesOutput,
    FindManyTransactionsOutput,
    FindOneCertificateOutput
} from "./profile.output"
import { ProfileService } from "./profile.service"


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

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyReceivedNotificationsOutput)
    async findManyReceivedNotifications(
        @AccountId() accountId: string,
        @Args("data") data: FindManyReceivedNotificationsInputData,
    ) {
        return this.profileService.findManyReceivedNotifications({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneCertificateOutput)
    async findOneCertificate(
        @AccountId() accountId: string,
        @Args("data") data: FindOneCertificateInputData,
    ) {
        return this.profileService.findOneCertificate({ accountId, data })
    }
}
