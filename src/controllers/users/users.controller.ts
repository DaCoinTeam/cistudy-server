import {
    Controller,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Patch,
} from "@nestjs/common"
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger"
import { UserId, AuthInterceptor, JwtAuthGuard } from "../shared"
import { UserMySqlEntity } from "@database"
import { Files } from "@common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ProfileService } from "./users.service"

@ApiTags("Profile")
@ApiQuery({
    name: "clientId",
    example: "4e2fa8d7-1f75-4fad-b500-454a93c78935",
})
@Controller("api/profile")
export class ProfileController{
    constructor(private readonly profileService: ProfileService) { }
}
