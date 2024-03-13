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
            CryptoWalletMySqlEntity
        ]),
    ],
    providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}
