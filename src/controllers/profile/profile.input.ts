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
        notificationIds : Array<string>
}

export class MarkNotificationAsReadInput implements AuthInput<MarkNotificationAsReadInputData> {
    accountId: string
    data: MarkNotificationAsReadInputData
}


export class DeleteNotificationInputData {
    @ApiProperty()
        notificationId : string
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