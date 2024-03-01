import { ApiProperty } from "@nestjs/swagger"

export class CreateCourseOutput {
    @ApiProperty()
        courseId: string
}
  