import { IEmptyDataInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateAvatarInput implements IEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}

export class UpdateCoverPhotoInput implements IEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}

