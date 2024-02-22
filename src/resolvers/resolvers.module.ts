import { Module } from "@nestjs/common"
import { CoursesModule } from "./courses"
import { PostsModule } from "./posts"
import { UsersModule } from "./users"
import { AuthModule } from "./auth"

@Module({
    imports: [AuthModule, CoursesModule, PostsModule, UsersModule],
})
export class ResolversModule { }
