import { Module } from "@nestjs/common"
import { AssetsController } from "./assets.controller"
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
import { AssetsService } from "./assets.service"

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
    controllers: [AssetsController],
    providers: [AssetsService],
})
export class AssetsModule {}
