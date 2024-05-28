import { Module } from "@nestjs/common"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    UserMySqlEntity,
    SessionMySqlEntity,
    CourseTargetMySqlEntity,
    CryptoWalletMySqlEntity,
    SubcategoyMySqlEntity,
    CategoryMySqlEntity,
    TopicMySqlEntity,
    CourseTopicMySqlEntity,
    SubcategoyTopicMySqlEntity,
    CourseSubcategoryMySqlEntity,
    CourseReviewMySqlEntity,
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
            LectureMySqlEntity,
            ResourceMySqlEntity,
            UserMySqlEntity,
            SessionMySqlEntity,
            CourseTargetMySqlEntity,
            CryptoWalletMySqlEntity,
            SubcategoyMySqlEntity,
            CategoryMySqlEntity,
            SubcategoyMySqlEntity,
            TopicMySqlEntity,
            CourseTopicMySqlEntity,
            SubcategoyTopicMySqlEntity,
            CourseSubcategoryMySqlEntity,
            CourseReviewMySqlEntity
        ]),
    ],
    providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
