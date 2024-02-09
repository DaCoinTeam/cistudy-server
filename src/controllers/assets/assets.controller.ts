import {
    Controller,
    Get,
    Query,
} from "@nestjs/common"
import {  ApiTags } from "@nestjs/swagger"
import AssetsService from "./assets.service"

@ApiTags("Assets")
@Controller("api/assets")
export default class AssetsController {
    constructor(private readonly assetsService: AssetsService){}
  @Get("get")
    async get(@Query("assetIdOrPath") assetIdOrPath: string) {
        return await this.assetsService.get({ data: assetIdOrPath })
    }
}
