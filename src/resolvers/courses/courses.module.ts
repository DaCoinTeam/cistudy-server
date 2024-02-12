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
            SessionMySqlEntity
        ]),
    ],
    providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
