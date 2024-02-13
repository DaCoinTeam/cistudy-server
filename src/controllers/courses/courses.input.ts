import { IAuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsUUID, Length } from "class-validator"

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

export class CreateCourseInput implements IAuthInput<CreateCourseData> {
  @IsUUID("4")
      userId: string
  data: CreateCourseData
  files: Express.Multer.File[]
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

export class UpdateCourseInput implements IAuthInput<UpdateCourseData> {
  @IsUUID("4")
      userId: string
  data: UpdateCourseData
  files: Express.Multer.File[]
}

export class CreateLectureData {
  @IsUUID("4")
  @ApiProperty()
      sectionId: string

  @Length(200)
  @ApiProperty()
      title: string
}
export class CreateLectureInput implements IAuthInput<CreateLectureData> {
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

export class CreateSectionInput implements IAuthInput<CreateSectionData> {
  @IsUUID("4")
      userId: string
  data: CreateSectionData
}
