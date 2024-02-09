import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CourseModule } from "./course"
import { AssetModule } from "./asset"
import { PostModule } from "./post"

@Module({
    imports: [
        AssetModule,
        AuthModule,
        CourseModule,
        PostModule
    ],
})
export default class ControllersModule {}
