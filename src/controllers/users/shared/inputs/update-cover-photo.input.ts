import { IAuthEmptyDataInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateCoverPhotoInput implements IAuthEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}