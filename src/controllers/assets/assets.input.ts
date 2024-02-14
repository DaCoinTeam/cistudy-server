import { Input } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { Response } from "express"

export class GetAssetData {
  @ApiProperty()
      assetIdOrPath: string
}
export class GetAssetInput implements Input<GetAssetData> {
  @ApiProperty()
      data: GetAssetData
}

export type GetFileOptions = Partial<{
  response: Response;
  range: string;
}>;
