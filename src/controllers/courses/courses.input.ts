import { AuthEmptyDataInput, AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsUUID, Length } from "class-validator"

export class CreateCourseInput implements AuthEmptyDataInput {
    @IsUUID("4")
        userId: string
}

export class CreateCourseTargetData {
    @IsUUID()
    @ApiProperty()
        courseId: string
    @ApiProperty()
        content: string
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
        position?: number
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
    files: Array<Express.Multer.File>
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
    @ApiProperty()
        title: string
}

export class CreateLectureInput implements AuthInput<CreateLectureData> {
    @IsUUID("4")
        userId: string
    data: CreateLectureData
}

export class DeleteLectureData {
    @IsUUID()
    @ApiProperty()
        lectureId: string
}

export class DeleteLectureInput
implements AuthInput<DeleteLectureData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteLectureData
}


export class CreateSectionData {
    @IsUUID("4")
    @ApiProperty()
        courseId: string

    @ApiProperty()
        title: string
}

export class CreateSectionInput implements AuthInput<CreateSectionData> {
    @IsUUID("4")
        userId: string
    data: CreateSectionData
}

export class CreateResourcesData {
    @IsUUID("4")
    @ApiProperty()
        lectureId: string
}
export class CreateResourcesInput implements AuthInput<CreateResourcesData> {
    @IsUUID("4")
        userId: string
    data: CreateResourcesData
    files: Express.Multer.File[]
}

export class UpdateLectureData {
    @IsUUID("4")
    @ApiProperty()
        lectureId: string
    @ApiProperty({ nullable: true })
        title?: string
    @ApiProperty({ nullable: true })
        thumbnailIndex?: number
    @ApiProperty({ nullable: true })
        lectureVideoIndex?: number
}

export class UpdateLectureInput implements AuthInput<UpdateLectureData> {
    @IsUUID("4")
        userId: string
    data: UpdateLectureData
    files: Express.Multer.File[]
}

export class DeleteSectionData {
    @IsUUID()
    @ApiProperty()
        sectionId: string
}

export class DeleteSectionInput
implements AuthInput<DeleteSectionData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteSectionData
}

export class UpdateSectionData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
        sectionId: string

    @Length(20)
    @ApiProperty({ nullable: true })
        title?: string
}

export class UpdateSectionInput implements AuthInput<UpdateSectionData> {
    @IsUUID("4")
        userId: string
    data: UpdateSectionData
}

export class DeleteResourceData {
    @IsUUID()
    @ApiProperty()
        resourceId: string
}

export class DeleteResourceInput
implements AuthInput<DeleteResourceData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteResourceData
}