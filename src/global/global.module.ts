import { Global, Module } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    LectureMySqlEntity,
    PostCommentContentMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostContentMySqlEntity,
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
    SupabaseService
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
            PostContentMySqlEntity,
            PostReactMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentContentMySqlEntity,
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
        SupabaseService,
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
        SupabaseService,
        JwtStrategy
    ],
})
export class GlobalModule { }
