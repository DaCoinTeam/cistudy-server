import { Module } from "@nestjs/common"
import { ProfileController } from "./users.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    SessionMySqlEntity,
    UserMySqlEntity,
    PostMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    PostCommentMySqlEntity,
    PostReactMySqlEntity,
    PostCommentLikeMySqlEntity,
} from "@database"
import { ProfileService } from "./users.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            UserMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LectureMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostReactMySqlEntity,
            PostCommentLikeMySqlEntity,
        ]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
