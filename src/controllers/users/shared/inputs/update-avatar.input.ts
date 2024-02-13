import { IAuthEmptyDataInput } from "@common"
import { IsUUID } from "class-validator"

export class UpdateAvatarInput implements IAuthEmptyDataInput {
    @IsUUID("4")
    	userId: string
    files: Express.Multer.File[]
}