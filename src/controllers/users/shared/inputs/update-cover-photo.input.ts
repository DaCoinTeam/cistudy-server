import { AuthEmptyDataInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateCoverPhotoInput implements AuthEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}