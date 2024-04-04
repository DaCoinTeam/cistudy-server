import { AuthEmptyDataInput, AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsUUID, Length } from "class-validator"

export class CreateCourseInput implements AuthEmptyDataInput {
    @IsUUID("4")
        userId: string
}

export class EnrollCourseInputData {
    @IsUUID("4")
    @ApiProperty()
        courseId: string
    @ApiProperty()
        code: string
}

export class EnrollCourseInput implements AuthInput<EnrollCourseInputData> {
    data: EnrollCourseInputData
    @IsUUID("4")
        userId: string
}

export class CreateCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
        courseId: string
    @ApiProperty()
        content: string
}

export class CreateCourseTargetInput
implements AuthInput<CreateCourseTargetInputData>
{
    @IsUUID("4")
        userId: string
    data: CreateCourseTargetInputData
}

export class UpdateCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
        courseTargetId: string
    @ApiProperty({ nullable: true })
        content?: string
    @ApiProperty({ nullable: true })
        position?: number
}

export class UpdateCourseTargetInput
implements AuthInput<UpdateCourseTargetInputData>
{
    @IsUUID("4")
        userId: string
    data: UpdateCourseTargetInputData
}

export class UpdateCourseInputData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
        courseId: string

    @Length(20)
    @ApiProperty({ nullable: true })
        title?: string

    @Length(100)
    @ApiProperty({ nullable: true })
        description?: string

    @ApiProperty({ nullable: true })
        price?: number

    @ApiProperty({ nullable: true })
        discountPrice?: number

    @ApiProperty({ nullable: true })
        enableDiscount?: boolean

    @ApiProperty({ nullable: true })
        categoryId?: string

    @ApiProperty({ nullable: true })    
        receivedWalletAddress?: string

    @ApiProperty({ nullable: true })
        subcategoryIds?: Array<string>

    @ApiProperty({ nullable: true })
        topicIds?: Array<string>

    @IsNumber()
    @ApiProperty({ nullable: true })
        thumbnailIndex?: number

    @IsNumber()
    @ApiProperty({ nullable: true })
        previewVideoIndex?: number
}

export class UpdateCourseInput implements AuthInput<UpdateCourseInputData> {
    @IsUUID("4")
        userId: string
    data: UpdateCourseInputData
    files: Array<Express.Multer.File>
}

export class DeleteCourseTargetInputData {
    @IsUUID()
    @ApiProperty()
        courseTargetId: string
}

export class DeleteCourseTargetInput
implements AuthInput<DeleteCourseTargetInputData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteCourseTargetInputData
}

export class CreateLectureInputData {
    @IsUUID("4")
    @ApiProperty()
        sectionId: string
    @ApiProperty()
        title: string
}

export class CreateLectureInput implements AuthInput<CreateLectureInputData> {
    @IsUUID("4")
        userId: string
    data: CreateLectureInputData
}

export class DeleteLectureInputData {
    @IsUUID()
    @ApiProperty()
        lectureId: string
}

export class DeleteLectureInput
implements AuthInput<DeleteLectureInputData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteLectureInputData
}


export class CreateSectionInputData {
    @IsUUID("4")
    @ApiProperty()
        courseId: string

    @ApiProperty()
        title: string
}

export class CreateSectionInput implements AuthInput<CreateSectionInputData> {
    @IsUUID("4")
        userId: string
    data: CreateSectionInputData
}

export class CreateResourcesInputData {
    @IsUUID("4")
    @ApiProperty()
        lectureId: string
}
export class CreateResourcesInput implements AuthInput<CreateResourcesInputData> {
    @IsUUID("4")
        userId: string
    data: CreateResourcesInputData
    files: Express.Multer.File[]
}

export class UpdateLectureInputData {
    @IsUUID("4")
    @ApiProperty()
        lectureId: string
    @ApiProperty({ nullable: true })
        title?: string
    @ApiProperty({ nullable: true })
        description?: string
    @ApiProperty({ nullable: true })
        thumbnailIndex?: number
    @ApiProperty({ nullable: true })
        lectureVideoIndex?: number
}

export class UpdateLectureInput implements AuthInput<UpdateLectureInputData> {
    @IsUUID("4")
        userId: string
    data: UpdateLectureInputData
    files: Express.Multer.File[]
}

export class DeleteSectionInputData {
    @IsUUID()
    @ApiProperty()
        sectionId: string
}

export class DeleteSectionInput
implements AuthInput<DeleteSectionInputData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteSectionInputData
}

export class UpdateSectionInputData {
    @IsUUID("4")
    @ApiProperty({ nullable: true })
        sectionId: string

    @Length(20)
    @ApiProperty({ nullable: true })
        title?: string
}

export class UpdateSectionInput implements AuthInput<UpdateSectionInputData> {
    @IsUUID("4")
        userId: string
    data: UpdateSectionInputData
}

export class DeleteResourceInputData {
    @IsUUID()
    @ApiProperty()
        resourceId: string
}

export class DeleteResourceInput
implements AuthInput<DeleteResourceInputData>
{
    @IsUUID("4")
        userId: string
    @ApiProperty()
        data: DeleteResourceInputData
}

//dev only apis
export class CreateCategoryInputData {
    @ApiProperty()
        name: string
}

export class CreateCategoryInput implements AuthInput<CreateCategoryInputData> {
    @IsUUID("4")
        userId: string
    data: CreateCategoryInputData
}

export class CreateSubcategoryInputData {
    @ApiProperty()
        name: string
    @ApiProperty()
        categoryId: string
}

export class CreateSubcategoryInput implements AuthInput<CreateSubcategoryInputData> {
    @IsUUID("4")
        userId: string
    data: CreateSubcategoryInputData
}

export class CreateTopicInputData {
    @ApiProperty()
        name: string
    @ApiProperty()
        subcategoryIds: Array<string>
}

export class CreateTopicInput implements AuthInput<CreateTopicInputData> {
    @IsUUID("4")
        userId: string
    data: CreateTopicInputData
    files: Array<Express.Multer.File>
}