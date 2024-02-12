import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SupabaseService } from "@global"
import { UpdateAvatarInput, UpdateCoverPhotoInput } from "./profile.input"
import { UserEntity } from "src/database/mysql/user.entity"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userMySqlRepository: Repository<UserEntity>,
        private readonly supabaseService: SupabaseService
    ) { }

    async updateCoverPhoto(input: UpdateCoverPhotoInput): Promise<string> {
        const { userId, files } = input
        const file = files.at(0)
        //validate to ensure it is image

        const { assetId } = await this.supabaseService.upload(file)

        await this.userMySqlRepository.update(userId, {
            coverPhotoId : assetId
        })

        return `A user with id ${userId} has had their cover photo updated successfully.`
    }

    async updateAvatar(input: UpdateAvatarInput): Promise<string> {
        const { userId, files } = input
        const file = files.at(0)
        //validate to ensure it is image

        const { assetId } = await this.supabaseService.upload(file)

        await this.userMySqlRepository.update(userId, {
            avatarId : assetId
        })

        return `A user with id ${userId} has had their avatar updated successfully.`
    }
}