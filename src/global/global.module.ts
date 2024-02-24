import { Global, Module } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    LectureMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostReactMySqlEntity,
    PostMySqlEntity,
    ResourceMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity,
    UserMySqlEntity
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    AuthManagerService,
    Bento4Service,
    FfmpegService,
    FirebaseService,
    MailerService,
    Sha256Service,
    ShellService,
    StorageService
} from "./services"
import { JwtStrategy } from "./strategies"

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            UserMySqlEntity,
            PostCommentMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LectureMySqlEntity,
            ResourceMySqlEntity,
            PostReactMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity
        ])
    ],
    exports: [
        JwtService,
        AuthManagerService,
        Bento4Service,
        FfmpegService,
        FirebaseService,
        MailerService,
        Sha256Service,
        ShellService,
        StorageService,
        JwtStrategy
    ],
    providers: [
        JwtService,
        AuthManagerService,
        Bento4Service,
        FfmpegService,
        FirebaseService,
        MailerService,
        Sha256Service,
        ShellService,
        StorageService,
        JwtStrategy
    ],
})
export class GlobalModule { }
