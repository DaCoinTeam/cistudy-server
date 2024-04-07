import { ApiProperty } from "@nestjs/swagger"

export class CreateCourseOutput {
    @ApiProperty()
        courseId: string
}

export class EnrollCourseOutput {
    @ApiProperty()
        enrolledInfoId: string
}
export class UpdateCourseOutput {
}


export class CreateCategoryOutput {
    @ApiProperty()
        categoryId: string
}

export class CreateSubcategoryOutput {
    @ApiProperty()
        subcategoryId: string
}

export class CreateTopicOutput {
    @ApiProperty()
        topicId: string
}

export class DeleteTopicOutputData {
}

