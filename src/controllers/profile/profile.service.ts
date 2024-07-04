import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"
import { StorageService } from "@global"
import { UpdateProfileInput } from "./profile.input"
import { AccountMySqlEntity } from "@database"
import { existKeyNotUndefined } from "@common"
import { UpdateProfileOutput } from "./profile.output"

@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(AccountMySqlEntity)
    private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    private readonly storageService: StorageService,
    ) {}

    async updateProfile(input: UpdateProfileInput): Promise<UpdateProfileOutput> {
        const { accountId, data, files } = input
        const { username, birthdate, avatarIndex, coverPhotoIndex, walletAddress } = data
        //validate to ensure it is image

        const { avatarId, coverPhotoId } = await this.accountMySqlRepository.findOneBy(
            { accountId },
        )

        const profile: DeepPartial<AccountMySqlEntity> = { username, birthdate, walletAddress }

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
                    coverPhotoId,
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

        if (existKeyNotUndefined(profile))
            await this.accountMySqlRepository.update(accountId, profile)

        return {message: `A profile with id ${accountId} has updated successfully.`}
    }
    
}
