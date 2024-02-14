import { Controller, Get, Headers, Param, Res } from "@nestjs/common"
import { ApiParam, ApiTags } from "@nestjs/swagger"
import { AssetsService } from "./assets.service"
import { join } from "path"
import { Response } from "express"

@ApiTags("Assets")
@Controller("api/assets")
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}
  @ApiParam({ name: "0", example: "Ignore me please", required: false })
  @Get("get-asset/:assetIdOrPath*")
    async getAsset(
    @Param("assetIdOrPath") assetIdOrPath: string,
    @Param("0") rest: string,
    @Res({ passthrough: true }) response: Response,
    @Headers("range") range: string,
    ) {
        return await this.assetsService.getAsset(
            { data: { assetIdOrPath: join(assetIdOrPath, rest) } },
            {
                response,
                range,
            },
        )
    }
}
