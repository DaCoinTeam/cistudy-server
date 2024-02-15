import {
    Controller,
    Post,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Body,
    Put,
    Delete,
    Param,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiTags,
} from "@nestjs/swagger"
import { UserId, AuthInterceptor, JwtAuthGuard, DataFromBody } from "../shared"
import {
    CreateCourseData,
    CreateCourseTargetData,
    CreateLectureData,
    CreateResourcesData,
    CreateSectionData,
    UpdateCourseData,
    UpdateCourseTargetData,
} from "./courses.input"

import {
    createCourseSchema,
    createLectureSchema,
    createResourcesSchema,
    updateCourseSchema,
} from "./courses.schema"

import { Files } from "@common"
import { CoursesService } from "./courses.service"
import { FileFieldsInterceptor } from "@nestjs/platform-express"

@ApiTags("Courses")
@ApiHeader({
    name: "Client-Id",
    description: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/courses")
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createCourseSchema })
  @Post("create-course")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      AuthInterceptor,
      FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
  )
    async createCourse(
    @UserId() userId: string,
    @DataFromBody() data: CreateCourseData,
    @UploadedFiles() { files }: Files,
    ) {
        return this.coursesService.createCourse({
            userId,
            data,
            files,
        })
    }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: updateCourseSchema })
  @Put("update-course")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      AuthInterceptor,
      FileFieldsInterceptor([{ name: "files", maxCount: 2 }]),
  )
  async updateCourse(
    @UserId() userId: string,
    @DataFromBody() data: UpdateCourseData,
    @UploadedFiles() { files }: Files,
  ) {
      return this.coursesService.updateCourse({
          userId,
          data,
          files,
      })
  }

  @ApiBearerAuth()
  @Post("create-course-target")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createCourseTarget(
    @UserId() userId: string,
    @Body() body: CreateCourseTargetData,
  ) {
      return this.coursesService.createCourseTarget({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @Put("update-course-target")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async updateCourseTarget(
    @UserId() userId: string,
    @Body() body: UpdateCourseTargetData,
  ) {
      return this.coursesService.updateCourseTarget({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @Delete("delete-course-target/:courseTargetId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async deleteCoureTarget(
    @UserId() userId: string,
    @Param("courseTargetId") courseTargetId: string,
  ) {
      return this.coursesService.deleteCourseTarget({
          userId,
          data: { courseTargetId },
      })
  }

  @ApiBearerAuth()
  @Post("create-section")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor)
  async createSection(
    @UserId() userId: string,
    @Body() body: CreateSectionData,
  ) {
      return this.coursesService.createSection({
          userId,
          data: body,
      })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createLectureSchema })
  @Post("create-lecture")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      AuthInterceptor,
      FileFieldsInterceptor([{ name: "files", maxCount: 1 }]),
  )
  async createLecture(
    @UserId() userId: string,
    @DataFromBody() data: CreateLectureData,
    @UploadedFiles() { files }: Files,
  ) {
      return this.coursesService.createLecture({
          userId,
          data,
          files,
      })
  }

  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: createResourcesSchema })
  @Post("create-resources")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      AuthInterceptor,
      FileFieldsInterceptor([{ name: "files", maxCount: 10 }]),
  )
  async createResoures(
    @UserId() userId: string,
    @DataFromBody() data: CreateResourcesData,
    @UploadedFiles() { files }: Files,
  ) {
      return this.coursesService.createResources({
          userId,
          data,
          files,
      })
  }
}
