import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindOneCourseInputData, FindManyCoursesInputData, FindManyLecturesInputData, FindManyResourcesInputData, FindOneLectureInputData, FindManyCourseTargetsInputData } from "./courses.input"
import { CoursesService } from "./courses.service"
import { CategoryMySqlEntity, CourseMySqlEntity, LectureMySqlEntity } from "@database"
import { FindManyCourseTargetsOutput, FindManyCoursesOutputData, FindManyResourcesOutput, FindOneLectureOutput } from "./courses.output"
import { UseGuards, UseInterceptors } from "@nestjs/common"
import { JwtAuthGuard, AuthInterceptor, UserId } from "../shared"

@Resolver()
export class CoursesResolver {
    constructor(
        private readonly coursesService: CoursesService,
    ) { }

    @Query(() => CourseMySqlEntity)
    async findOneCourse(@Args("data") data: FindOneCourseInputData) {
        return await this.coursesService.findOneCourse({ data })
    }

    @Query(() => FindManyCoursesOutputData)
    async findManyCourses(@Args("data") data: FindManyCoursesInputData) {
        return await this.coursesService.findManyCourses({ data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindOneLectureOutput)
    async findOneLecture(@UserId() userId: string, @Args("data") data: FindOneLectureInputData) {
        return await this.coursesService.findOneLecture({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => [LectureMySqlEntity])
    async findManyLectures(@UserId() userId: string,  @Args("data") data: FindManyLecturesInputData) {
        return await this.coursesService.findManyLectures({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyResourcesOutput)
    async findManyResources(@UserId() userId: string, @Args("data") data: FindManyResourcesInputData) {
        return await this.coursesService.findManyResources({ userId, data })
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuthInterceptor)
    @Query(() => FindManyCourseTargetsOutput)
    async findManyCourseTargets(@UserId() userId: string, @Args("data") data: FindManyCourseTargetsInputData) {
        return await this.coursesService.findManyCourseTargets({ userId, data })
    }

    @Query(() => [CategoryMySqlEntity])
    async findManyCategories() {
        return await this.coursesService.findManyCategories()
    }

}
