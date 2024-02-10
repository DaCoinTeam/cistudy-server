import { Module } from "@nestjs/common"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    SectionMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    UserMySqlEntity,
    SessionMySqlEntity,
} from "@database"
import { CourseResolvers } from "./course.resolvers"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoursesService } from "./course.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LectureMySqlEntity,
            ResourceMySqlEntity,
            UserMySqlEntity,
            SessionMySqlEntity
        ]),
    ],
    providers: [CourseResolvers, CoursesService],
})
export class CourseModule {}
