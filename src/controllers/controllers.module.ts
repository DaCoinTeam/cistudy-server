import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CoursesModule } from "./courses"
import { AssetsModule } from "./assets"
import { PostsModule } from "./posts"
import { ProfileModule } from "./profile"

@Module({
    imports: [
        AssetsModule,
        AuthModule,
        CoursesModule,
        PostsModule,
        ProfileModule
    ],
    providers: []
})
export class ControllersModule {}
