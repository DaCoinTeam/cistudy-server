import { AuthEmptyDataInput, AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"
import { Address } from "web3"

export class UpdateProfileData {
    @ApiProperty()
        username?: string
    @ApiProperty()
        avatarIndex?: number
    @ApiProperty()
        coverPhotoIndex?: number
    @ApiProperty()
        birthdate?: Date
    @ApiProperty()
        walletAddress?: Address
}
export class UpdateProfileInput implements AuthInput<UpdateProfileData> {
    @IsUUID("4")
        accountId: string
    data: UpdateProfileData
    files: Array<Express.Multer.File>
}

export class WithdrawData {
    @ApiProperty()
        withdrawAmount?: number
}
export class WithdrawInput implements AuthInput<WithdrawData> {
    @IsUUID("4")
        accountId: string
    data: WithdrawData
}

export class DepositData {
    @ApiProperty()
        transactionHash: string
    @ApiProperty()
        maxQueries?: number
    @ApiProperty()
        queryIntervalMs?: number
}

export class DepositInput implements AuthInput<DepositData> {
    @IsUUID("4")
        accountId: string
    data: DepositData
}

export class MarkNotificationAsReadInputData {
    @ApiProperty()
        notificationIds: Array<string>
}

export class MarkNotificationAsReadInput implements AuthInput<MarkNotificationAsReadInputData> {
    accountId: string
    data: MarkNotificationAsReadInputData
}


export class DeleteNotificationInputData {
    @ApiProperty()
        notificationId: string
}

export class DeleteNotificationInput implements AuthInput<DeleteNotificationInputData> {
    accountId: string
    data: DeleteNotificationInputData
}


export class MarkAllNotificationsAsReadInput implements AuthEmptyDataInput {
    accountId: string
}

export class IsSastifyCommunityStandardInput {
    @ApiProperty()
        message: string
}

export class AddJobInputData {
    @ApiProperty()
        companyName: string
    @ApiProperty()
        role: string
    @ApiProperty()
        startDate: Date
    @ApiProperty()
        endDate?: Date
    @ApiProperty()
        companyLogoIndex: number
}

export class AddJobInput implements AuthInput<AddJobInputData> {
    accountId: string
    data: AddJobInputData
    files: Express.Multer.File[]
}

export class UpdateJobInputData {
    @IsUUID("4")
    @ApiProperty()
        accountJobId?: string
    @ApiProperty()
        companyName?: string
    @ApiProperty()
        role?: string
    @ApiProperty()
        startDate?: Date
    @ApiProperty()
        endDate?: Date
    @ApiProperty()
        companyLogoIndex?: number
}

export class UpdateJobInput implements AuthInput<UpdateJobInputData> {
    accountId: string
    data: UpdateJobInputData
    files?: Express.Multer.File[]
}

export class DeleteJobInputData {
    @IsUUID()
    @ApiProperty()
        accountJobId : string
}

export class DeleteJobInput implements AuthInput<DeleteJobInputData> {
    accountId: string
    data: DeleteJobInputData
}

export class AddQualificationInputData {
    @ApiProperty()
        name : string
    @ApiProperty()
        issuedFrom : string
    @ApiProperty()
        issuedAt : Date
    @ApiProperty()
        url? : string
    @ApiProperty()
        fileIndex: number
}

export class AddQualificationInput implements AuthInput<AddQualificationInputData> {
    data: AddQualificationInputData
    accountId: string
    files: Express.Multer.File[]
}

export class UpdateQualificationInputData {
    @ApiProperty()
        accountQualificationId? : string
    @ApiProperty()
        name? : string
    @ApiProperty()
        issuedFrom? : string
    @ApiProperty()
        issuedAt? : Date
    @ApiProperty()
        url? : string
    @ApiProperty()
        fileIndex? : number
}

export class UpdateQualificationInput implements AuthInput<UpdateQualificationInputData> {
    data: UpdateQualificationInputData
    accountId: string
    files?: Express.Multer.File[]
}

export class DeleteQualificationInputData {
    @IsUUID()
    @ApiProperty()
        accountQualificationId : string
}

export class DeleteQualificationInput implements AuthInput<DeleteQualificationInputData>{
    accountId: string
    data: DeleteQualificationInputData
}

export class RegisterInstructorInput implements AuthEmptyDataInput {
    accountId: string
}
