import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { StorageService } from "@global"
import { UpdateAvatarInput, UpdateCoverPhotoInput } from "./shared"
import { UserEntity } from "src/database/mysql/user.entity"

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userMySqlRepository: Repository<UserEntity>,
        private readonly storageService: StorageService
    ) { }

    async updateCoverPhoto(input: UpdateCoverPhotoInput): Promise<string> {
        const { userId, files } = input
        const file = files.at(0)
        //validate to ensure it is image

        const { assetId } = await this.storageService.upload(file)

        await this.userMySqlRepository.update(userId, {
            coverPhotoId : assetId
        })

        return `A user with id ${userId} has had their cover photo updated successfully.`
    }

    async updateAvatar(input: UpdateAvatarInput): Promise<string> {
        const { userId, files } = input
        const file = files.at(0)
        //validate to ensure it is image

        const { assetId } = await this.storageService.upload(file)

        await this.userMySqlRepository.update(userId, {
            avatarId : assetId
        })

        return `A user with id ${userId} has had their avatar updated successfully.`
    }
}