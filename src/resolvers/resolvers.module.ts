import { Module } from "@nestjs/common"
import { CoursesModule } from "./course"
import { PostModule } from "./post"

@Module({
    imports: [CoursesModule, PostModule],
})
export class ResolversModule {}
