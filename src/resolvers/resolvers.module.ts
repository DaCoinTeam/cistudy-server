import { Module } from "@nestjs/common"
import { CoursesModule } from "./courses"
import { PostsModule } from "./posts"
import { AccountsModule } from "./accounts"
import { AuthModule } from "./auth"
import { ProfileModule } from "./profile"
import { CartModule } from "./cart"

@Module({
    imports: [AuthModule, CoursesModule, PostsModule, AccountsModule, ProfileModule, CartModule],
})
export class ResolversModule { }
