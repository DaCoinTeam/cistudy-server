import { IFileInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateAvatarInput implements IFileInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}

export class UpdateCoverPhotoInput implements IFileInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}

