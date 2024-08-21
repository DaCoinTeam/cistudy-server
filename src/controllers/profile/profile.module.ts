import { Module } from "@nestjs/common"
import { ProfileController } from "./profile.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    SessionMySqlEntity,
    AccountMySqlEntity,
    PostMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LessonMySqlEntity,
    ResourceMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentLikeMySqlEntity,
    FollowMySqlEnitity,
    TransactionMongoEntitySchema,
    TransactionMongoEntity,
    TransactionMySqlEntity,
    NotificationMySqlEntity,
    AccountJobMySqlEntity,
    AccountQualificationMySqlEntity,
    RoleMySqlEntity,
} from "@database"
import { ProfileService } from "./profile.service"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            AccountMySqlEntity,
            AccountJobMySqlEntity,
            RoleMySqlEntity,
            AccountQualificationMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostCommentMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentLikeMySqlEntity,
            FollowMySqlEnitity,
            TransactionMySqlEntity,
            NotificationMySqlEntity
        ]),
        MongooseModule.forFeature([
            {
                name: TransactionMongoEntity.name,
                schema: TransactionMongoEntitySchema,
            },
        ]),
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export class ProfileModule {}
