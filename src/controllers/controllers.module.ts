import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CourseModule } from "./course"
import { AssetModule } from "./asset"
import { PostModule } from "./post"
import { JwtStrategy } from "./shared"

@Module({
    imports: [
        AssetModule,
        AuthModule,
        CourseModule,
        PostModule
    ],
    providers: [
        JwtStrategy
    ]
})
export default class ControllersModule {}
