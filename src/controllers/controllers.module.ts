import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CoursesModule } from "./courses"
import { AssetsModule } from "./assets"
import { PostsModule } from "./posts"
import { JwtStrategy } from "./shared"

@Module({
    imports: [
        AssetsModule,
        AuthModule,
        CoursesModule,
        PostsModule
    ],
    providers: [
        JwtStrategy
    ]
})
export default class ControllersModule {}
