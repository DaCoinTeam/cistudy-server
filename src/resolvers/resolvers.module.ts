import { Module } from "@nestjs/common"
import { CoursesModule } from "./courses"
import { PostsModule } from "./posts"
import { ProfileModule } from "./profile"
import { UsersModule } from "./users"

@Module({
    imports: [CoursesModule, PostsModule, ProfileModule, UsersModule],
})
export class ResolversModule {}
