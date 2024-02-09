import {
    Controller,
    Get,
    Query,
} from "@nestjs/common"
import {  ApiTags } from "@nestjs/swagger"
import AssetService from "./asset.service"

@ApiTags("Assets")
@Controller("api/assets")
export default class AssetController {
    constructor(private readonly assetService: AssetService){}
  @Get("get")
    async get(@Query("assetIdOrPath") assetIdOrPath: string) {
        return await this.assetService.get({ data: assetIdOrPath })
    }
}
