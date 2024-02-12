import {
    Controller,
    Post,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Body,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiTags,
} from "@nestjs/swagger"
import {
    UserId,
    AuthInterceptor,
    JwtAuthGuard,
    DataFromBody,
    CreateCourseData,
    createCourseSchema,
    CreateLectureData,
    createLectureSchema,
    CreateSectionData,
} from "../shared"
import { UserMySqlEntity } from "@database"
import { Files } from "@common"
import { CoursesService } from "./courses.service"
import { FileFieldsInterceptor } from "@nestjs/platform-express"

@ApiTags("Courses")
@ApiQuery({
    name: "clientId",
    example: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
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
    AuthInterceptor<UserMySqlEntity>,
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
  @Post("create-section")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthInterceptor<UserMySqlEntity>)
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
    AuthInterceptor<UserMySqlEntity>,
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
}
