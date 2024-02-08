import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CourseModule } from "./course"
import { AssetModule } from "./asset"

@Module({
    imports: [
        AssetModule,
        AuthModule,
        CourseModule,
    ],
})
export default class ControllersModule {}
