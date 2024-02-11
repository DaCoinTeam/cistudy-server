import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiParam, ApiTags } from "@nestjs/swagger"
import { AssetsService } from "./assets.service"
import { join } from "path"

@ApiTags("Assets")
@Controller("api/assets")
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}
  @ApiParam({ name: "0", example: "Ignore me please", required: false })
  @Get("get/:assetIdOrPath*")
    async get(
    @Param("assetIdOrPath") assetIdOrPath: string,
    @Param("0") rest: string,

    ) {
        return await this.assetsService.get({ data: join(assetIdOrPath, rest) })
    }
}
