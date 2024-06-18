import { Module } from "@nestjs/common"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LessonMySqlEntity,
    ResourceMySqlEntity,
    AccountMySqlEntity,
    SessionMySqlEntity,
    CourseTargetMySqlEntity,
    CryptoWalletMySqlEntity,
    CategoryMySqlEntity,
    CourseReviewMySqlEntity,
    QuizAttemptMySqlEntity,
} from "@database"
import { CoursesResolver } from "./courses.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoursesService } from "./courses.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            AccountMySqlEntity,
            SessionMySqlEntity,
            CourseTargetMySqlEntity,
            CryptoWalletMySqlEntity,
            CategoryMySqlEntity,
            CourseReviewMySqlEntity,
            QuizAttemptMySqlEntity,
        ]),
    ],
    providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
