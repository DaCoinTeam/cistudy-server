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
    private readonly storageService: StorageService,
    ) {}

    async updateProfile(input: UpdateProfileInput): Promise<string> {
        const { userId, data, files } = input
        const { username, avatarIndex, coverPhotoIndex } = data
        //validate to ensure it is image

        const { avatarId, coverPhotoId } = await this.userMySqlRepository.findOneBy(
            { userId },
        )

        const profile: DeepPartial<UserMySqlEntity> = { username }
        
        if (Number.isInteger(avatarIndex)) {
            const file = files.at(avatarIndex)
            if (avatarId) {
                await this.storageService.update(
                    avatarId,
                    {
                        rootFile: file,
                    },
                )
            } else {
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                profile.avatarId = assetId
            }
        }
        if (Number.isInteger(coverPhotoIndex)) {
            const file = files.at(coverPhotoIndex)
            if (coverPhotoId) {
                await this.storageService.update(
                    avatarId,
                    {
                        rootFile: file,
                    },

                )
            } else {
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                profile.coverPhotoId = assetId
            }
        }
        if (Object.keys(profile).length)
            await this.userMySqlRepository.update(userId, profile)

        return `A profile with id ${userId} has updated successfully.`
    }
}
