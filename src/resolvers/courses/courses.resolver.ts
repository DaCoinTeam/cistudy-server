import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseInputData, FindManyCoursesInputData, FindManyLessonsInputData, FindManyResourcesInputData, FindOneLessonInputData, FindManyCourseTargetsInputData, FindOneCourseAuthInputData, FindOneCourseReviewInputData, FindManyCourseReviewsInputData, FindManyCoursesTopicInputData } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CategoryMySqlEntity, CourseMySqlEntity, CourseReviewMySqlEntity, TopicMySqlEntity } from "@database"
import { FindManyCourseReviewsOutputData, FindManyCourseTargetsOutput, FindManyCoursesOutputData, FindManyCoursesTopicOutputData, FindManyLessonsOutput, FindManyResourcesOutput, FindOneCourseAuthOutput, FindOneLessonOutput } from "./courses.output"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { JwtAuthGuard, AuthInterceptor, AccountId } from "../shared"

@Resolver()
export class CoursesResolver {
    constructor(
        private readonly coursesService: CoursesService,
    ) { }

    @Query(() => CourseMySqlEntity)
    async findOneCourse(@Args("data") data: FindOneCourseInputData) {
        return await this.coursesService.findOneCourse({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneCourseAuthOutput)
    async findOneCourseAuth(@AccountId() accountId: string, @Args("data") data: FindOneCourseAuthInputData) {
        return await this.coursesService.findOneCourseAuth({ data, accountId })
    }

    @Query(() => FindManyCoursesOutputData)
    async findManyCourses(@Args("data") data: FindManyCoursesInputData) {
        return await this.coursesService.findManyCourses({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneLessonOutput)
    async findOneLesson(@AccountId() accountId: string, @Args("data") data: FindOneLessonInputData) {
        return await this.coursesService.findOneLesson({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyLessonsOutput)
    async findManyLessons(@AccountId() accountId: string, @Args("data") data: FindManyLessonsInputData) {
        return await this.coursesService.findManyLessons({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyResourcesOutput)
    async findManyResources(@AccountId() accountId: string, @Args("data") data: FindManyResourcesInputData) {
        return await this.coursesService.findManyResources({ accountId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyCourseTargetsOutput)
    async findManyCourseTargets(@AccountId() accountId: string, @Args("data") data: FindManyCourseTargetsInputData) {
        return await this.coursesService.findManyCourseTargets({ accountId, data })
    }

    @Query(() => [CategoryMySqlEntity])
    async findManyCategories() {
        return await this.coursesService.findManyCategories()
    }

    @Query(() => CourseReviewMySqlEntity)
    async findOneCourseReview(@Args("data") data: FindOneCourseReviewInputData) {
        return await this.coursesService.findOneCourseReview({ data })
    }
    
    @Query(() => FindManyCourseReviewsOutputData)
    async findManyCourseReviews(@Args("data") data : FindManyCourseReviewsInputData) {
        return await this.coursesService.findManyCourseReviews({data})
    }

    // @Query(() => [TopicMySqlEntity])
    // async findManyTopics() {
    //     return await this.coursesService.findManyCoursesTopic({data})
    // }

    @Query(() => FindManyCoursesTopicOutputData)
    async findManyCoursesTopic(@Args("data") data : FindManyCoursesTopicInputData) {
        return await this.coursesService.findManyCoursesTopic({data})
    }

}
