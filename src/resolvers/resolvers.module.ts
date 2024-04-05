import { Module } from "@nestjs/common"
import { CoursesModule } from "./courses"
import { PostsModule } from "./posts"
import { UsersModule } from "./users"
import { AuthModule } from "./auth"
import { ProfileModule } from "./profile"
import { TransactionsModule } from "./transactions"

@Module({
    imports: [AuthModule, CoursesModule, PostsModule, UsersModule, ProfileModule, TransactionsModule],
})
export class ResolversModule { }
