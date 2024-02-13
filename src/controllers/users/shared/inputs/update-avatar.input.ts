import { AuthEmptyDataInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateAvatarInput implements AuthEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}