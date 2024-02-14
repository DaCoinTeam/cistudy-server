import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"
import { StorageService } from "@global"
import { UpdateProfileInput } from "./profile.input"
import { UserEntity } from "src/database/mysql/user.entity"
import { UserMySqlEntity } from "@database"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userMySqlRepository: Repository<UserEntity>,
        private readonly storageService: StorageService
    ) { }

    async updateProfile(input: UpdateProfileInput): Promise<string> {
        const { userId, data, files } = input
        const { avatarIndex, coverPhotoIndex } = data
        //validate to ensure it is image

        const profile : DeepPartial<UserMySqlEntity> = {}
        if (Number.isInteger(avatarIndex)) {
            const file = files.at(avatarIndex)
            const { assetId } = await this.storageService.upload(file)
            profile.avatarId = assetId
        }
        if (Number.isInteger(coverPhotoIndex)) {
            const file = files.at(coverPhotoIndex)
            const { assetId } = await this.storageService.upload(file)
            profile.coverPhotoId = assetId
        }
        await this.userMySqlRepository.update(userId, profile)

        return `A profile with id ${userId} has updated successfully.`
    }
}