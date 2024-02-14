import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNumber, IsUUID, Length } from "class-validator"

export class CreateCourseData {
  @Length(20)
  @ApiProperty()
      title: string

  @Length(100)
  @ApiProperty()
      description: string

  @IsNumber()
  @ApiProperty()
      price: number
}

export class CreateCourseInput implements AuthInput<CreateCourseData> {
  @IsUUID("4")
      userId: string
  data: CreateCourseData
  files: Array<Express.Multer.File>
}

export class CreateCourseTargetData {
  @IsUUID()
  @ApiProperty()
      courseId: string
  @ApiProperty()
      content: string
  @IsInt()
  @ApiProperty()
      index: number
}

export class CreateCourseTargetInput
implements AuthInput<CreateCourseTargetData>
{
  @IsUUID("4")
      userId: string
  data: CreateCourseTargetData
}

export class UpdateCourseTargetData {
  @IsUUID()
  @ApiProperty()
      courseTargetId: string
  @ApiProperty({ nullable: true })
      content?: string
  @ApiProperty({ nullable: true })
      index?: number
}

export class UpdateCourseTargetInput
implements AuthInput<UpdateCourseTargetData>
{
  @IsUUID("4")
      userId: string
  data: UpdateCourseTargetData
}

export class UpdateCourseData {
  @IsUUID("4")
  @ApiProperty({ nullable: true })
      courseId: string

  @Length(20)
  @ApiProperty({ nullable: true })
      title?: string

  @Length(100)
  @ApiProperty({ nullable: true })
      description?: string

  @IsNumber()
  @ApiProperty({ nullable: true })
      price?: number

  @IsNumber()
  @ApiProperty({ nullable: true })
      thumbnailIndex?: number

  @IsNumber()
  @ApiProperty({ nullable: true })
      previewVideoIndex?: number
}

export class UpdateCourseInput implements AuthInput<UpdateCourseData> {
  @IsUUID("4")
      userId: string
  data: UpdateCourseData
  files: Express.Multer.File[]
}

export class DeleteCourseTargetData {
  @IsUUID()
  @ApiProperty()
      courseTargetId: string
}

export class DeleteCourseTargetInput
implements AuthInput<DeleteCourseTargetData>
{
  @IsUUID("4")
      userId: string
  @ApiProperty()
      data: DeleteCourseTargetData
}

export class CreateLectureData {
  @IsUUID("4")
  @ApiProperty()
      sectionId: string

  @Length(200)
  @ApiProperty()
      title: string
}
export class CreateLectureInput implements AuthInput<CreateLectureData> {
  @IsUUID("4")
      userId: string
  data: CreateLectureData
  files: Express.Multer.File[]
}

export class CreateSectionData {
  @IsUUID("4")
  @ApiProperty()
      courseId: string

  @Length(200)
  @ApiProperty()
      title: string
}

export class CreateSectionInput implements AuthInput<CreateSectionData> {
  @IsUUID("4")
      userId: string
  data: CreateSectionData
}
