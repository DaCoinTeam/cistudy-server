import { ApiProperty } from "@nestjs/swagger"

export class CreateCourseOutput {
    @ApiProperty()
        courseId: string
}
  
export class EnrollCourseOutput {
    @ApiProperty()
        enrolledInfoId: string
}
  