import { Module } from "@nestjs/common"
import { CoursesModule } from "./courses"
import { PostsModule } from "./posts"
import { ProfileModule } from "./profile"

@Module({
    imports: [CoursesModule, PostsModule, ProfileModule],
})
export class ResolversModule {}
