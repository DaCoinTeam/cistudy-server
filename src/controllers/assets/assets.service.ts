import { getContentType } from "@common"
import { StorageService } from "@global"
import { HttpStatus, Injectable, StreamableFile } from "@nestjs/common"
import { GetAssetInput, GetFileOptions } from "./assets.input"

@Injectable()
export class AssetsService {
    constructor(private readonly storageService: StorageService) { }

    async getAsset(
        input: GetAssetInput,
        options?: GetFileOptions,
    ): Promise<StreamableFile> {
        const { data } = input
        const { assetIdOrPath } = data
        const { range } = options

        //if headers has range, mean that is it an videos
        if (range) return await this.getVideoAsset(assetIdOrPath, options)
        return await this.getStaticAsset(assetIdOrPath)
    }

    private async getStaticAsset(assetIdOrPath: string): Promise<StreamableFile> {
        const filename = await this.storageService.getFilename(assetIdOrPath)
        const readStream =
            await this.storageService.createReadStream(assetIdOrPath)

        return new StreamableFile(readStream, {
            type: getContentType(filename),
            disposition: `inline; filename="${filename}"`,
        })
    }

    private async getVideoAsset(
        assetIdOrPath: string,
        options?: GetFileOptions,
    ): Promise<StreamableFile> {
        const { range, response } = options

        if (!range) throw new Error("Range is required.")

        const filename = await this.storageService.getFilename(assetIdOrPath)
        const { size } = await this.storageService.getStat(assetIdOrPath)
        const parts = range.replace(/bytes=/, "").split("-")
        const start = Number.parseInt(parts.at(0), 10)
        const partAtOne = parts.at(1)
        const end = partAtOne ? Number.parseInt(partAtOne, 10) : size - 1
        const chunksize = end - start + 1

        response.setHeader("Content-Range", `bytes ${start}-${end}/${size}`)
        response.setHeader("Accept-Ranges", "bytes")

        response.statusCode = HttpStatus.PARTIAL_CONTENT

        const readStream = await this.storageService.createReadStream(
            assetIdOrPath,
            {
                start,
                end,
            },
        )
        return new StreamableFile(readStream, {
            type: getContentType(filename),
            length: chunksize
        })
    }
}
