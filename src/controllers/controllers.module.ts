import { Module } from "@nestjs/common"

import { AuthModule } from "./auth"
import { CoursesModule } from "./courses"
import { AssetsModule } from "./assets"
import { PostsModule } from "./posts"
import { ProfileModule } from "./profile"
import { UsersModule } from "./users"
import { TestModule } from "./test/test.module"
import { CartModule } from "./cart"



@Module({
    imports: [
        AssetsModule,
        AuthModule,
        CoursesModule,
        PostsModule,
        ProfileModule,
        UsersModule,
        TestModule,
        CartModule
    ],
    providers: []
})
export class ControllersModule {}
