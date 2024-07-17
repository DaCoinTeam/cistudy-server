import { Global, Module } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import {
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    LessonMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
    ResourceMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity,
    AccountMySqlEntity,
    RoleMySqlEntity
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    AuthManagerService,
    Bento4Service,
    BlockchainService,
    FfmpegService,
    FirebaseService,
    MailerService,
    PaypalService,
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
            AccountMySqlEntity,
            PostCommentMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity,
            RoleMySqlEntity
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
        JwtStrategy,
        BlockchainService,
        PaypalService
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
        JwtStrategy,
        BlockchainService,
        PaypalService
    ],
})
export class GlobalModule { }
